import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import { BackendError, BackendResponse } from "../../lib/commonTypes"
import EditBlog, { CREATE_BLOG_TITLE, EDIT_BLOG_TITLE } from "../../pages/EditBlog"
import { checkMobileEditorForContent, checkMobileEditorForContentAsync, typeContentIntoMobileEditor } from "../components/blog/mobile/helpers/mobileEditorHelpers"

// Mock the QuestionMark animated icon as we can't test the animation
jest.mock("../../components/animation/QuestionMark", () => {
  return () => <div>Mocked QuestionMark Animation</div>
})

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

  it("Does not display any content inside the html and css desktop editors", () => {
    setup(BASE_PATH, BASE_PATH)
    const htmlEditor = screen.getAllByRole("textbox")[0]
    const cssEditor = screen.getAllByRole("textbox")[1]

    expect(htmlEditor).toHaveTextContent("")
    expect(cssEditor).toHaveTextContent("")
  })

  it("Does not display any content inside the mobile editor", () => {
    setup(BASE_PATH, BASE_PATH)
    checkMobileEditorForContent("", "both")
  })

  describe("Page title", () => {
    function itBehavesLikeShowCorrectTitle(title: string) {
      it("Sets the page title to indicate that a new blog is being created", () => {
        setup(BASE_PATH, BASE_PATH)
        expect(document.title.includes(title)).toBe(true)
      })
    }

    describe("When there is no unsaved work in local storage", () => {
      itBehavesLikeShowCorrectTitle(CREATE_BLOG_TITLE)
    })

    describe("When there is unsaved work in local storage", () => {
      beforeEach(() => {
        // Mock an unsaved blog in local storage
        Storage.prototype.getItem = (key: string) => {
          switch (key) {
            case "userId":
              return "someUserId"
            case "unsaved_HTML_Content":
              return "some html content"
            default:
              return "some css content"
          }
        }
      })

      itBehavesLikeShowCorrectTitle(CREATE_BLOG_TITLE)
    })
  })

  describe("When the user is not signed in", () => {
    beforeAll(() => {
      // Mock the browser local storage
      Storage.prototype.getItem = (key: string) => null
    })

    it("Disables the \"Create/Save\" button", () => {
      setup(BASE_PATH, BASE_PATH)
      const createBtn = screen.getByRole("button", { name: /Create/ })

      expect(createBtn).toHaveAttribute("disabled")
    })
  })

  describe("When the user is signed in", () => {
    beforeAll(() => {
      // Mock the browser local storage
      Storage.prototype.getItem = (key: string) => "someFakeId"
    })

    it("Does not disable the \"Create/Save\" button", () => {
      setup(BASE_PATH, BASE_PATH)
      const createBtn = screen.getByRole("button", { name: /Create/ })

      expect(createBtn).not.toHaveAttribute("disabled")
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

      function runSetupAndTypeSomeHtml() {
        setup(BASE_PATH, BASE_PATH)
        const htmlEditor = screen.getAllByRole("textbox")[0]
        userEvent.type(htmlEditor, "Some Html!")
      }

      function itBehavesLikeShowLoadingIndicator() {
        it("Goes into a loading state when clicked on", async () => {
          runSetupAndTypeSomeHtml()
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
          runSetupAndTypeSomeHtml()
          const createBtn = screen.getByRole("button", { name: /Create/ })
          fireEvent.click(createBtn)

          // Wait until the loading is done and the saving animation appears
          const savingBtn = await screen.findByTestId("savingAnimation")
          expect(savingBtn).toBeInTheDocument()
        })

        it("Reverts back to the normal state after the saving animation, but displays \"Save\" instead of \"Create\"", async () => {
          runSetupAndTypeSomeHtml()
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
          runSetupAndTypeSomeHtml()
          const createBtn = screen.getByRole("button", { name: /Create/ })
          fireEvent.click(createBtn)

          const errHeading = await screen.findByRole("heading", { name: new RegExp(`Error ${ERR_CODE}`) })
          expect(errHeading).toBeInTheDocument()
        })

        it("Outputs the error to console error", async () => {
          runSetupAndTypeSomeHtml()
          const createBtn = screen.getByRole("button", { name: /Create/ })
          fireEvent.click(createBtn)

          await screen.findByRole("heading", { name: new RegExp(`Error ${ERR_CODE}`) })
          expect(consoleErrMock).toHaveBeenCalledWith(ERR)
        })
      })
    })
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

  it("Displays the content of the blog in the desktop editors", async () => {
    setup(BASE_PATH + BLOG_ID, PATH)

    const htmlEditor = await screen.findByTestId(/desktopEditor_html/i)
    const cssEditor = await screen.findByTestId(/desktopEditor_css/i)
    const output = await screen.findByTitle<HTMLIFrameElement>("output")

    const html = within(htmlEditor).getByText(HTML)
    const css = within(cssEditor).getByText(CSS)

    expect(html).toBeInTheDocument()
    expect(css).toBeInTheDocument()
    expect(output.srcdoc.includes(HTML)).toBe(true)
    expect(output.srcdoc.includes(CSS)).toBe(true)
  })

  it("Displays the content of the blog in the mobile editor", async () => {
    setup(BASE_PATH + BLOG_ID, PATH)
    await checkMobileEditorForContentAsync(HTML, "html")
    await checkMobileEditorForContentAsync(CSS, "css")
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

  describe("Page title", () => {
    it("Sets the page title to indicate that an existing blog is being edited", async () => {
      setup(BASE_PATH + BLOG_ID, PATH)
      // Wait until the mock api has finished before continuing
      await screen.findAllByText(HTML)

      expect(document.title.includes(EDIT_BLOG_TITLE)).toBe(true)
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

describe("Unsaved work", () => {
  let saveBlogSpy: jest.SpyInstance

  beforeEach(() => {
    // Mock the Api.saveBlog method
    saveBlogSpy = jest.spyOn(Api, "saveBlog").mockImplementation(
      async (html: string, css: string, blogId?: string | null) => {
        return { success: { id: "someBlogId" } }
      }
    )
  })

  afterAll(() => {
    // Restore the Api.saveBlog mock
    saveBlogSpy.mockRestore()
  })

  describe("When creating a new blog", () => {
    function itBehavesLikeStoreUnsavedAdditions(prevHtml: string, prevCss: string) {
      describe("When adding more unsaved content", () => {
        const setItemMock = jest.fn()

        beforeEach(() => {
          // Mock the local storage setter
          setItemMock.mockClear()
          Storage.prototype.setItem = setItemMock
        })

        describe("Desktop", () => {
          it("Saves the new content to local storage", () => {
            setup(BASE_PATH, BASE_PATH)

            const htmlTextbox = within(screen.getByTestId("HTMLEditor")).getByRole("textbox")
            const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")

            userEvent.type(htmlTextbox, "A")
            expect(setItemMock).toHaveBeenCalledWith("unsaved_HTML_Content", prevHtml + "A")

            userEvent.type(cssTextbox, "A")
            expect(setItemMock).toHaveBeenCalledWith("unsaved_CSS_Content", prevCss + "A")
          })
        })

        describe("Mobile", () => {
          it("Saves the new content to local storage", () => {
            setup(BASE_PATH, BASE_PATH)

            // html
            typeContentIntoMobileEditor("A", "html")
            expect(setItemMock).toHaveBeenCalledWith("unsaved_HTML_Content", prevHtml + "A")

            // css
            typeContentIntoMobileEditor("A", "css")
            expect(setItemMock).toHaveBeenCalledWith("unsaved_CSS_Content", prevCss + "A")
          })
        })
      })
    }

    function itBehavesLikeClearStorage() {
      describe("When adding content and then saving the work", () => {
        const removeItemMock = jest.fn()

        beforeEach(() => {
          // Mock the local storage removeItem method
          Storage.prototype.removeItem = removeItemMock
        })

        it("Clears stored content in local storage", async () => {
          setup(BASE_PATH, BASE_PATH)
          const htmlTextbox = within(screen.getByTestId("HTMLEditor")).getByRole("textbox")
          const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")
          const saveBtn = screen.getByTestId("saveBtn")

          userEvent.type(htmlTextbox, "A")
          userEvent.type(cssTextbox, "A")
          userEvent.click(saveBtn)

          // Wait for the "saving" to complete
          await screen.findByTestId("savingAnimation")

          expect(removeItemMock).toHaveBeenCalledWith("unsaved_HTML_Content")
          expect(removeItemMock).toHaveBeenCalledWith("unsaved_CSS_Content")
        })
      })
    }

    describe("When creating a new blog with unsaved work in local storage", () => {
      const HTML = "some unsaved html!"
      const CSS = "some unsaved css"

      beforeEach(() => {
        // Mock an unsaved blog in local storage
        Storage.prototype.getItem = (key: string) => {
          switch (key) {
            case "userId":
              // Return a fake user id so that the component thinks we are logged in
              return "someUserId"
            case "unsaved_HTML_Content":
              return HTML
            default:
              return CSS
          }
        }
      })

      it("Fills the desktop editors with the unsaved content", () => {
        setup(BASE_PATH, BASE_PATH)
        const htmlTextbox = within(screen.getByTestId("HTMLEditor")).getByRole("textbox")
        const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")

        expect(htmlTextbox).toHaveTextContent(HTML)
        expect(cssTextbox).toHaveTextContent(CSS)
      })

      it("Fills the mobile editor with the unsaved content", () => {
        setup(BASE_PATH, BASE_PATH)
        checkMobileEditorForContent(HTML, "html")
        checkMobileEditorForContent(CSS, "css")
      })

      itBehavesLikeStoreUnsavedAdditions(HTML, CSS)

      itBehavesLikeClearStorage()
    })

    describe("When creating a new blog with no unsaved work in local storage", () => {
      beforeEach(() => {
        // Mock local storage
        Storage.prototype.getItem = (key: string) => {
          switch (key) {
            case "userId":
              // Return a fake user id so that the component thinks we are logged in
              return "someUserId"
            default:
              return null
          }
        }
      })

      it("Does not display any content in any of the desktop editors", () => {
        setup(BASE_PATH, BASE_PATH)
        const htmlTextbox = within(screen.getByTestId("HTMLEditor")).getByRole("textbox")
        const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")

        expect(htmlTextbox).toHaveTextContent("")
        expect(cssTextbox).toHaveTextContent("")
      })

      it("Does not display any content in the mobile editor", () => {
        setup(BASE_PATH, BASE_PATH)
        checkMobileEditorForContent("", "both")
      })

      itBehavesLikeStoreUnsavedAdditions("", "")

      itBehavesLikeClearStorage()
    })

    describe("After saving a blog", () => {
      const HTML = "some html that is now saved"
      const CSS = "some css that is now saved"
      let setItemMock = jest.fn()

      beforeEach(() => {
        // Mock local storage getItem to make the component think we are logged in
        Storage.prototype.getItem = (key: string) => {
          if (key === "userId") return "someUserId"
          return null
        }

        // Mock local storage setItem to keep track of what is being stored
        Storage.prototype.setItem = setItemMock
      })

      it("Does not store any further unsaved changes", async () => {
        setup(BASE_PATH, BASE_PATH)

        const htmlTextbox = within(screen.getByTestId("HTMLEditor")).getByRole("textbox")
        const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")
        const saveBtn = screen.getByTestId("saveBtn")

        // Save some initial blog
        userEvent.type(htmlTextbox, HTML)
        userEvent.type(cssTextbox, CSS)
        userEvent.click(saveBtn)

        // Wait for saving to "finish"
        await screen.findByTestId("savingAnimation")

        // Now clear the local storage mock and type some additional changes
        setItemMock.mockClear()
        userEvent.type(htmlTextbox, "more html")
        userEvent.type(cssTextbox, "more css")

        // Do the same for the mobile editor
        typeContentIntoMobileEditor("even more html", "html")
        typeContentIntoMobileEditor("even more css", "css")

        // Ensure that the additional changes were not stored
        expect(setItemMock).not.toHaveBeenCalled()
      })
    })
  })

  describe("When editing an existing blog", () => {
    const BLOG_ID = "someBlogId"

    const setItemMock = jest.fn()
    let getBlogMock: jest.SpyInstance

    beforeEach(() => {
      // Mock the Api.getBlog method
      getBlogMock = jest.spyOn(Api, "getBlog").mockImplementation(async (blogId: string) => {
        return { success: { blog: { id: BLOG_ID, html: "someHtml", css: "someCss" } } }
      })

      // Mock the local storage setItem method
      Storage.prototype.setItem = setItemMock
      // Mock the local storage getItem method to make it appear that we are signed in
      Storage.prototype.getItem = (key: string) => {
        if (key === "userId") return "someUserId"
        return null
      }
    })

    afterAll(() => {
      // Restore the Api.getBlog mock
      getBlogMock.mockRestore()
    })

    it("Does not store any unsaved work", async () => {
      setup(BASE_PATH + BLOG_ID, BASE_PATH + ":blogId")

      // Before grabbing the first editor, wait for it to appear as the page will initially be loading the blog
      const htmlTextbox = within(await screen.findByTestId("HTMLEditor")).getByRole("textbox")
      const cssTextbox = within(screen.getByTestId("CSSEditor")).getByRole("textbox")

      // Type into the desktop editors
      userEvent.type(htmlTextbox, "some more html")
      userEvent.type(cssTextbox, "some more css")

      // Type into the mobile editor
      typeContentIntoMobileEditor("even more html", "html")
      typeContentIntoMobileEditor("even more css", "css")

      // Ensure nothing was stored in local storage
      expect(setItemMock).not.toHaveBeenCalled()
    })
  })
})

describe("Mobile specific", () => {
  describe("When creating a new blog", () => {
    describe("When there is content in the editor", () => {
      const HTML = "some html!"
      const CSS = "some CSS!"

      function setupContent() {
        setup(BASE_PATH, BASE_PATH)
        typeContentIntoMobileEditor(HTML, "html")
        typeContentIntoMobileEditor(CSS, "css")
      }

      describe("When clicking the editor titles", () => {
        it("Switches back and forth between displaying the HTML and CSS content", () => {
          setupContent()

          // Initially only html content should be showing
          checkMobileEditorForContent(HTML, "html")
          checkMobileEditorForContent(CSS, "html", true)

          // Now switch to css, and ensure only css content is showing
          checkMobileEditorForContent(CSS, "css")
          checkMobileEditorForContent(HTML, "css", true)

          // Finally, switch back to html, and ensure only html is showing
          checkMobileEditorForContent(HTML, "html")
          checkMobileEditorForContent(CSS, "html", true)
        })
      })

      describe("When signed in", () => {
        describe("When clicking the save button", () => {
          let saveBlogMock: jest.SpyInstance<
            Promise<BackendError | { success: { id: string } }>,
            [html: string, css: string, blogId?: string | null]
          >

          beforeEach(() => {
            // Mock the browser local storage to fake being signed in
            Storage.prototype.getItem = (key: string) => {
              if (key === "userId") return "someFakeId"
              return null
            }

            // Spy on and mock the Api saveBlog method
            saveBlogMock = jest.spyOn(Api, "saveBlog").mockImplementation(async () => {
              // Wait for a short time
              await new Promise<void>((resolve, reject) => {
                setTimeout(() => resolve(), 20)
              })

              // Then return a fake successful response
              return { success: { id: "someBlogId" } }
            })
          })

          afterAll(() => {
            saveBlogMock.mockRestore()
          })

          it("Saves the content", async () => {
            setupContent()
            const saveBtn = screen.getByTestId("saveBtn")
            userEvent.click(saveBtn)

            // Wait until loading is done
            await screen.findByTestId("savingCheckmark")

            // Now ensure an attempt was made to save the content
            expect(saveBlogMock).toHaveBeenCalledWith(HTML, CSS, undefined)
          })
        })
      })
    })
  })
})