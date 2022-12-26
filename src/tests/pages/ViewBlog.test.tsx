import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom"
import Api, { BlogProps } from "../../lib/api/Api"
import { BackendError, FrontendError } from "../../lib/commonTypes"
import ViewBlog, { VIEW_BLOG_TITLE } from "../../pages/ViewBlog"

// Set up the Api.getBlog spy
const getBlogMock = jest.spyOn(Api, "getBlog")
// Setup the console error spy
const consoleErrMock = jest.spyOn(console, "error").mockImplementation(
  (message: any) => { }
)
// Setup the local storage.getItem spy
const getItemMock = jest.spyOn(Storage.prototype, "getItem")
// Setup the Api.deleteBlog mock
const deleteBlogMock = jest.spyOn(Api, "deleteBlog")
// Mock the navbar
jest.mock("../../components/Navbar", () => {
  return () => <div>Mocked Navbar!</div>
})

const BLOG_ID = "someBlogId"

function MockEditBlog() {
  const { blogId } = useParams()
  return <div>Edit blog page with blogId={blogId}</div>
}

const VIEW_BLOGS_PAGE_TXT = "View blogs page"

function setup() {
  render(
    <MemoryRouter initialEntries={[`/blog/${BLOG_ID}`]}>
      <Routes>
        <Route path="/blog/:blogId" element={<ViewBlog />} />
        <Route path="/editblog/:blogId" element={<MockEditBlog />} />
        <Route path="/viewblogs" element={<div>{VIEW_BLOGS_PAGE_TXT}</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("When given a valid blog id", () => {
  const BLOG: BlogProps = {
    html: "someHtml",
    css: "someCss",
    id: BLOG_ID,
    userId: "someUserId",
    creationDate: "1/1/1",
    summaryTitle: "someSummaryTitle",
    summaryDescription: "someSummaryDescription",
    summaryImg: "http//:someImage",
    tags: ["tag1", "tag2"]
  }

  function itBehavesLikeDisplayBlogContent() {
    it("Displays the content of the blog", async () => {
      setup()
      const output = await screen.findByTitle<HTMLIFrameElement>("output")
      expect(output.srcdoc.includes(BLOG.html)).toBe(true)
      expect(output.srcdoc.includes(BLOG.css)).toBe(true)
    })
  }

  beforeEach(() => {
    getBlogMock.mockResolvedValue({ success: { blog: BLOG } })
  })

  describe("When the user is not the creator of the blog", () => {
    beforeEach(() => {
      // localstorage.getItem should return the id of some other user
      getItemMock.mockReset().mockReturnValue("someOtherUserId")
    })

    itBehavesLikeDisplayBlogContent()

    it("Does not display an edit blog button", async () => {
      setup()
      await screen.findByTitle("output")
      const editBtn = screen.queryByRole("button", { name: "Edit" })
      expect(editBtn).not.toBeInTheDocument()
    })

    it("Does not display a delete blog button", async () => {
      setup()
      await screen.findByTitle("output")
      const deleteBtn = screen.queryByRole("button", { name: "Delete" })
      expect(deleteBtn).not.toBeInTheDocument()
    })
  })

  describe("When the user is the creator of the blog", () => {
    beforeEach(() => {
      // localstorage.getItem should return the same id as the creator of the blog
      getItemMock.mockReset().mockReturnValue(BLOG.userId)
    })

    itBehavesLikeDisplayBlogContent()

    it("Displays an edit blog button", async () => {
      setup()
      await screen.findByTitle("output")
      const editBtn = screen.getByRole("button", { name: /edit/i })
      expect(editBtn).toBeInTheDocument()
    })

    it("Displays a delete blog button", async () => {
      setup()
      await screen.findByTitle("output")
      const deleteBtn = screen.getByRole("button", { name: /delete/i })
      expect(deleteBtn).toBeInTheDocument()
    })

    describe("When clicking the \"Edit\" button", () => {
      it("Redirects the client to the edit blog page for that blog", async () => {
        setup()
        const editBtn = await screen.findByRole("button", { name: /edit/i })
        userEvent.click(editBtn)

        const editBlogPage = await screen.findByText(/Edit blog page/)
        expect(editBlogPage).toHaveTextContent(new RegExp(BLOG.id))
      })
    })

    describe("When clicking the \"Delete\" button", () => {
      async function clickDeleteSetup() {
        setup()
        const deleteBtn = await screen.findByRole("button", { name: /delete/i })
        userEvent.click(deleteBtn)
      }

      describe("When the deletion is successful", () => {
        beforeEach(() => {
          deleteBlogMock.mockReset().mockImplementation(async (blogId: string) => {
            await new Promise<void>((resolve, reject) => {
              setTimeout(() => resolve(), 10)
            })

            return { success: { id: BLOG_ID } }
          })
        })

        it("Sets the delete button to a loading state", async () => {
          await clickDeleteSetup()
          const loadingBtn = screen.getByRole("button", { name: /loading/i })
          expect(loadingBtn).toBeInTheDocument()
        })

        it("Disables all buttons", async () => {
          await clickDeleteSetup()
          const allBtns = screen.getAllByRole("button")

          for (const btn of allBtns) {
            expect(btn).toHaveAttribute("disabled")
          }
        })

        it("Replaces the \"loading\" animation with a \"deleted\" animation when the deletion is successful", async () => {
          await clickDeleteSetup()
          const deletedBtn = await screen.findByText(/Deleted/)
          const loadingBtn = screen.queryByRole("button", { name: /loading/i })

          expect(deletedBtn).toBeInTheDocument()
          expect(loadingBtn).not.toBeInTheDocument()
        })

        it("Redirects client to the View Blogs page when the deletion animation is complete", async () => {
          await clickDeleteSetup()
          const binLid = await screen.findByTestId("binLid")
          fireEvent.animationEnd(binLid)

          const viewBlogsPage = await screen.findByText(VIEW_BLOGS_PAGE_TXT)
          expect(viewBlogsPage).toBeInTheDocument()
        })
      })

      describe("When the deletion is unsuccessful", () => {
        const ERROR = new FrontendError("Could not delete", 500)

        beforeEach(() => {
          deleteBlogMock.mockReset().mockImplementation(async () => {
            await new Promise<void>((resolve, reject) => {
              setTimeout(() => resolve(), 10)
            })

            throw new FrontendError(ERROR.message, ERROR.code)
          })

          consoleErrMock.mockReset()
        })

        it("Displays and error on the page", async () => {
          await clickDeleteSetup()
          const error = await screen.findByRole("heading", { name: new RegExp(`Error ${ERROR.code}`) })
          expect(error).toBeInTheDocument()
        })

        it("Outputs the error to console error", async () => {
          await clickDeleteSetup()
          await screen.findByRole("heading", { name: new RegExp(`Error ${ERROR.code}`) })
          expect(consoleErrMock).toHaveBeenCalledWith(ERROR)
        })
      })
    })
  })
})

describe("When given an invalid blog id", () => {
  const ERROR: BackendError = { simpleError: "Given blog id does not exist!", code: 400 }

  beforeEach(() => {
    getBlogMock.mockReset().mockResolvedValue(ERROR)
  })

  it("Outputs the error response to console error", async () => {
    setup()
    await screen.findByRole("heading", { name: /Error/ })
    expect(consoleErrMock).toHaveBeenCalledWith(ERROR)
  })

  it("Displays an error on the page", async () => {
    setup()
    const errHeading = await screen.findByRole("heading", { name: new RegExp(`Error ${ERROR.code}`) })
    expect(errHeading).toBeInTheDocument()
  })
})

describe("Page title", () => {
  const BLOG: BlogProps = {
    html: "someHtml",
    css: "someCss",
    id: BLOG_ID,
    userId: "someUserId",
    creationDate: "1/1/1",
    summaryTitle: "",
    summaryDescription: "someSummaryDescription",
    summaryImg: "http//:someImage",
    tags: ["tag1", "tag2"]
  }

  beforeEach(() => {
    getBlogMock.mockResolvedValue({ success: { blog: BLOG } })
  })

  describe("When the blog has a summary title", () => {
    beforeEach(() => {
      BLOG.summaryTitle = "someSummaryTitle"
    })

    it("Displays the summary title of the blog in the page title", async () => {
      setup()
      await screen.findByTitle("output")
      expect(document.title.includes(BLOG.summaryTitle)).toBe(true)
    })
  })

  describe("When the blog does not have a summary title", () => {
    beforeEach(() => {
      BLOG.summaryTitle = ""
    })

    it("Displays a generic page title about viewing a blog", async () => {
      setup()
      await screen.findByTitle("output")
      expect(document.title.includes(VIEW_BLOG_TITLE)).toBe(true)
    })
  })
})