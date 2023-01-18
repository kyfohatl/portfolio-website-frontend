import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { EditorProps } from "../../../../components/blog/Editor"
import { TextInfo } from "../../../../components/blog/EditorBody"
import MobileEditor from "../../../../components/blog/mobile/MobileEditor"
import { checkMobileEditorForContent, typeContentIntoMobileEditor } from "./helpers/mobileEditorHelpers"

const setTextHtml = jest.fn((textInfo: TextInfo) => { })
const setTextCss = jest.fn((textInfo: TextInfo) => { })

const HTML: EditorProps = {
  textInfo: { text: "someHtml!", change: { changeType: "Other" } },
  setText: setTextHtml,
  title: "html"
}
const CSS: EditorProps = {
  textInfo: { text: "someCss!", change: { changeType: "Other" } },
  setText: setTextCss,
  title: "css"
}

describe("When given some HTML and CSS", () => {
  function setup() {
    render(<MobileEditor html={HTML} css={CSS} />)
  }

  describe("When the HTML editor is the active editor", () => {
    it("Displays HTML content, and does not display CSS content", () => {
      setup()
      checkMobileEditorForContent(HTML.textInfo.text, "html")
      checkMobileEditorForContent(CSS.textInfo.text, "html", true)
    })

    describe("When making a change to the editor text", () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it("Calls the HTML set text function, and not the CSS one", () => {
        setup()
        typeContentIntoMobileEditor("a", "html")

        expect(setTextHtml).toHaveBeenCalledWith({ text: HTML.textInfo.text + "a", change: { changeType: "Other" } })
        expect(setTextCss).not.toHaveBeenCalled()
      })
    })

    describe("When clicking the CSS editor title", () => {
      it("Switches over to the CSS editor, and display CSS content instead of HTML", () => {
        setup()
        checkMobileEditorForContent(CSS.textInfo.text, "css")
        checkMobileEditorForContent(HTML.textInfo.text, "css", true)
      })

      describe("When making a change to the editor text", () => {
        beforeEach(() => {
          jest.clearAllMocks()
        })

        it("Calls the CSS set text function, and not the HTML one", () => {
          setup()
          typeContentIntoMobileEditor("a", "css")

          expect(setTextCss).toHaveBeenCalledWith({ text: CSS.textInfo.text + "a", change: { changeType: "Other" } })
          expect(setTextHtml).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("When the CSS editor is the active editor", () => {
    function setupCss() {
      setup()
      const cssTitle = screen.getByTestId("editorTitle_css")
      userEvent.click(cssTitle)
    }

    describe("When clicking the HTML editor title", () => {
      it("Displays HTML content instead of CSS content", () => {
        setupCss()
        const htmlTitle = screen.getByTestId("editorTitle_html")
        userEvent.click(htmlTitle)
        const textarea = within(screen.getByTestId("mobileEditor")).getByRole("textbox")

        expect(textarea).toHaveTextContent(HTML.textInfo.text)
        expect(textarea).not.toHaveTextContent(CSS.textInfo.text)
      })
    })
  })
})