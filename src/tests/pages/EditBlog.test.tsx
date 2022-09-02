import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import { BackendError, BackendResponse } from "../../lib/commonTypes"
import EditBlog from "../../pages/EditBlog"

const BASE_PATH = "/editblog/"

function setup(initRoute: string, path: string) {
  render(
    <MemoryRouter initialEntries={[initRoute]}>
      <Routes>
        <Route path={path} element={<EditBlog />} />
      </Routes>
    </MemoryRouter>
  )
}

describe("When there is no blog id in the page route params", () => {
  it("Displays a \"Create\" button instead of a \"Save\" button", () => {
    setup(BASE_PATH, BASE_PATH)
    const createBtn = screen.getByRole("button", { name: /Create/ })
    const saveBtn = screen.queryByRole("button", { name: /Save/ })

    expect(createBtn).toBeInTheDocument()
    expect(saveBtn).not.toBeInTheDocument()
  })

  describe("When the \"Create/Save\" button is clicked", () => {
    let saveBlogMock: jest.SpyInstance<
      Promise<BackendError | { success: { id: string } }>,
      [html: string, css: string, blogId?: string | null]
    >

    afterAll(() => {
      // Restore the Api.saveBlog method
      saveBlogMock.mockRestore()
    })

    function itBehavesLikeShowLoadingIndicator() {
      it("Goes into a loading state when clicked on", async () => {
        setup(BASE_PATH, BASE_PATH)
        const createBtn = screen.getByRole("button", { name: /Create/ })
        fireEvent.click(createBtn)

        // Check if the loading button is present
        const loadingBtn = screen.getByRole("button", { name: /loading/i })
        expect(loadingBtn).toBeInTheDocument()

        // Wait for the loading button to disappear which indicates that the Api.saveBlog is finished and the component
        // can now un-mount (otherwise react will throw a warning about the state of an unmounted component being
        // updated)
        await waitForElementToBeRemoved(loadingBtn)
      })
    }

    describe("When the save succeeds", () => {
      beforeEach(() => {
        // Mock the Api.saveBlog method
        saveBlogMock = jest.spyOn(Api, "saveBlog").mockImplementation(async () => {
          // Wait for a bit
          await new Promise<void>((resolve, reject) => {
            setTimeout(() => { resolve() }, 20)
          })

          // Then return a fake successful response
          return { success: { id: "someBlogId" } }
        })
      })

      itBehavesLikeShowLoadingIndicator()

      it("Goes into a saving state once finished saving a blog", async () => {
        setup(BASE_PATH, BASE_PATH)
        const createBtn = screen.getByRole("button", { name: /Create/ })
        fireEvent.click(createBtn)

        // Wait until the loading is done and the saving animation appears
        const savingBtn = await screen.findByTestId("savingAnimation")
        expect(savingBtn).toBeInTheDocument()
      })

      it("Reverts back to the normal state after the saving animation, but displays \"Save\" instead of \"Create\"", async () => {
        setup(BASE_PATH, BASE_PATH)
        const createBtn = screen.getByRole("button", { name: /Create/ })
        fireEvent.click(createBtn)

        // Wait until loading is done
        const savingBtnCheckmark = await screen.findByTestId("savingCheckmark")
        expect(savingBtnCheckmark).toBeInTheDocument()

        // Now trigger the onAnimationEnd
        fireEvent.animationEnd(savingBtnCheckmark)

        // Now ensure changes are correct
        const saveBtn = screen.getByRole("button", { name: /Save/ })
        const savingBtn = screen.queryByTestId("savingAnimation")
        const loadingBtn = screen.queryByRole("button", { name: /loading/i })

        expect(saveBtn).toBeInTheDocument()
        expect(savingBtn).not.toBeInTheDocument()
        expect(loadingBtn).not.toBeInTheDocument()
        expect(createBtn).not.toBeInTheDocument()
        expect(savingBtnCheckmark).not.toBeInTheDocument()
      })
    })

    describe("When the save fails", () => {
      const ERR_MESSAGE = "Some Error Occurred"
      const ERR_CODE = 404
      const ERR = { simpleError: ERR_MESSAGE, code: ERR_CODE }

      let consoleErrMock: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>
      beforeEach(() => {
        // Setup the Api.saveBlog mock
        saveBlogMock.mockImplementation(async () => (ERR))
        // Mock console error
        consoleErrMock = jest.spyOn(console, "error").mockImplementation(() => { })
      })

      afterAll(() => {
        // Restore the console error mock
        consoleErrMock.mockRestore()
      })

      itBehavesLikeShowLoadingIndicator()

      it("Displays an error on the page with the returned status code", async () => {
        setup(BASE_PATH, BASE_PATH)
        const createBtn = screen.getByRole("button", { name: /Create/ })
        fireEvent.click(createBtn)

        const errHeading = await screen.findByRole("heading", { name: new RegExp(`Error ${ERR_CODE}`) })
        expect(errHeading).toBeInTheDocument()
      })

      it("Outputs the error to console error", async () => {
        setup(BASE_PATH, BASE_PATH)
        const createBtn = screen.getByRole("button", { name: /Create/ })
        fireEvent.click(createBtn)

        await screen.findByRole("heading", { name: new RegExp(`Error ${ERR_CODE}`) })
        expect(consoleErrMock).toHaveBeenCalledWith(ERR)
      })
    })
  })

  it("Does not display any content inside the html and css editors", async () => {
    setup(BASE_PATH, BASE_PATH)
    const htmlEditor = screen.getAllByRole("textbox")[0]
    const cssEditor = screen.getAllByRole("textbox")[1]

    expect(htmlEditor).toHaveTextContent("")
    expect(cssEditor).toHaveTextContent("")
  })
})

describe("When there is a valid blog id in the page route params", () => {
  const PATH = BASE_PATH + ":blogId"
  const BLOG_ID = "someBlogId"
  const HTML = "<div>Some html!</div>"
  const CSS = "div {color: red;}"

  let getBlogMock: jest.SpyInstance<Promise<BackendResponse>, [blogId: string]>
  beforeEach(() => {
    // Setup the Api.getBlog method mock
    getBlogMock = jest.spyOn(Api, "getBlog").mockImplementation(async () => ({
      success: {
        blog: { id: BLOG_ID, html: HTML, css: CSS }
      }
    }))
  })

  afterAll(() => {
    getBlogMock.mockRestore()
  })

  it("Displays a \"Save\" button instead of a \"Create\" button", async () => {
    setup(BASE_PATH + BLOG_ID, PATH)

    // Wait until the mock Api.getBlog has "finished" before accessing the buttons
    const saveBtn = await screen.findByRole("button", { name: /Save/ })
    const createBtn = screen.queryByRole("button", { name: /Create/ })

    expect(saveBtn).toBeInTheDocument()
    expect(createBtn).not.toBeInTheDocument()
  })

  it("Displays the content of the blog", async () => {
    setup(BASE_PATH + BLOG_ID, PATH)

    const html = await screen.findByText(HTML)
    const css = await screen.findByText(CSS)
    const output = await screen.findByTitle<HTMLIFrameElement>("output")

    expect(html).toBeInTheDocument()
    expect(css).toBeInTheDocument()
    expect(output.srcdoc.includes(HTML)).toBe(true)
    expect(output.srcdoc.includes(CSS)).toBe(true)
  })

  describe("When the \"Save\" button is clicked", () => {
    let saveBlogMock: jest.SpyInstance<
      Promise<BackendError | { success: { id: string } }>,
      [html: string, css: string, blogId?: string | null]
    >

    beforeEach(() => {
      // Setup the Api.saveBlog mock
      saveBlogMock = jest.spyOn(Api, "saveBlog").mockImplementation(async (
        html: string,
        css: string,
        blogId?: string | null
      ) => ({
        success: { id: BLOG_ID }
      }))
    })

    afterAll(() => {
      // Restore saveBlog mock
      saveBlogMock.mockRestore()
    })

    it("Attempts to save the modified blog content to the database", async () => {
      // Run other setup
      setup(BASE_PATH + BLOG_ID, PATH)
      // Wait for the page to finish loading
      const saveBtn = await screen.findByRole("button", { name: /Save/ })

      // Now modify the blog content
      const additionalHtml = "<p>Some paragraph content</p>"
      const additionalCss = "p"
      const htmlEditor = screen.getAllByRole("textbox")[0]
      const cssEditor = screen.getAllByRole("textbox")[1]

      userEvent.type(htmlEditor, additionalHtml)
      userEvent.type(cssEditor, additionalCss)

      // Save the modified content
      fireEvent.click(saveBtn)

      // Ensure the page tried to save the content
      expect(saveBlogMock).toHaveBeenCalledWith(
        HTML + additionalHtml,
        CSS + additionalCss,
        BLOG_ID
      )

      // Wait for the loading to finish before allowing component unmount (which happens when the "Saving"
      // animation appears)
      await screen.findByTestId("savingAnimation")
    })
  })
})

describe("When there is an invalid blog id in the page route params", () => {
  const BLOG_ID = "someInvalidBlogId"
  const ERROR: BackendError = { simpleError: "Given blog id does not exist!", code: 400 }

  let getBlogMock: jest.SpyInstance<Promise<BackendResponse>, [blogId: string]>
  let consoleErrMock: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>
  beforeEach(() => {
    // Setup the Api.getBlog mock
    getBlogMock = jest.spyOn(Api, "getBlog").mockResolvedValue(ERROR)
    // Mock console error
    consoleErrMock = jest.spyOn(console, "error").mockImplementation((message: any) => { })
  })

  afterAll(() => {
    // Restore the Api.getBlog mock
    getBlogMock.mockRestore()
    // Restore console error
    consoleErrMock.mockRestore()
  })

  it("Displays a \"Not Found\" error", async () => {
    setup(BASE_PATH + BLOG_ID, BASE_PATH + ":blogId")
    const error = await screen.findByRole("heading", { name: new RegExp(`Error ${ERROR.code}`) })
    expect(error).toBeInTheDocument()
  })

  it("Outputs the error to console error", async () => {
    setup(BASE_PATH + BLOG_ID, BASE_PATH + ":blogId")
    await waitFor(() => expect(consoleErrMock).toHaveBeenCalledWith(ERROR))
  })
})