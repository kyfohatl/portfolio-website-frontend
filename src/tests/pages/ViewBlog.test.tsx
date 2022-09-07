import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api, { BlogProps } from "../../lib/api/Api"
import { BackendError } from "../../lib/commonTypes"
import ViewBlog from "../../pages/ViewBlog"

// Set up the Api.getBlog spy
const getBlogMock = jest.spyOn(Api, "getBlog")
// Setup the console error spy
const consoleErrMock = jest.spyOn(console, "error").mockImplementation(
  (message: any) => { }
)
// Setup the local storage.getItem spy
const getItemMock = jest.spyOn(Storage.prototype, "getItem")

const BLOG_ID = "someBlogId"

function setup() {
  render(
    <MemoryRouter initialEntries={[`/blog/${BLOG_ID}`]}>
      <Routes>
        <Route path="/blog/:blogId" element={<ViewBlog />} />
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
      getItemMock.mockReset().mockReturnValue(BLOG.id)
    })

    itBehavesLikeDisplayBlogContent()
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