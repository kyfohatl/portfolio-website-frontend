import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Editor from "../../../components/blog/Editor"
import { TextInfo } from "../../../components/blog/EditorBody"
import { EditorType } from "../../../components/blog/EditorTitle"

const TITLE: EditorType = "html"
const TEXT = "someText"
const setTextMock = jest.fn((textInfo: TextInfo) => { })

beforeEach(() => {
  setTextMock.mockReset().mockImplementation(jest.fn((textInfo: TextInfo) => { }))
})

function setup() {
  render(<Editor title={TITLE} setText={setTextMock} textInfo={{ text: TEXT, change: { changeType: "Other" } }} />)
}

describe("When given a title and some text", () => {
  it("Displays given title at the top of the component", () => {
    setup()
    const title = screen.getByText(new RegExp(TITLE, "i"))
    expect(title).toBeInTheDocument()
  })

  it("Displays the given text", () => {
    setup()
    const textBox = screen.getByRole("textbox")
    expect(textBox).toHaveTextContent(TEXT)
  })

  it("Calls the setText function with the new text when it is typed into", () => {
    setup()
    const textBox = screen.getByRole("textbox")
    // Type into the text box
    userEvent.type(textBox, "1")
    // Check if the changes were sent in the setText function
    expect(setTextMock).toHaveBeenCalledWith({ change: { changeType: "Other" }, text: TEXT + "1" })
  })
})

describe("When normal text is typed into the editor", () => {
  describe("When the selection cursor is at the end of the text", () => {
    it("Adds the typed character to the end of the text", () => {
      setup()
      const textBox = screen.getByRole("textbox")
      // Type at the end of the text
      userEvent.type(textBox, "g")
      // Check if the typed character appears at the end of the text
      expect(setTextMock).toHaveBeenCalledWith({ change: { changeType: "Other" }, text: TEXT + "g" })
    })
  })

  describe("When the selection cursor is at the start of the text", () => {
    it("Adds the typed character to the start of the text", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type at the start of the text
      textBox.setSelectionRange(0, 0)
      userEvent.type(textBox, "g", { initialSelectionStart: 0, initialSelectionEnd: 0 })
      // Check if the typed character appears at the start of the text
      expect(setTextMock).toHaveBeenCalledWith({ change: { changeType: "Other" }, text: "g" + TEXT })
    })
  })

  describe("When the selection cursor is in the middle of the text", () => {
    it("Adds the typed character to the middle of the text", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type into the middle of the text
      textBox.setSelectionRange(3, 3)
      userEvent.type(textBox, "g", { initialSelectionStart: 3, initialSelectionEnd: 3 })
      // Check if the typed character appears at the right spot
      expect(setTextMock).toHaveBeenCalledWith({ change: { changeType: "Other" }, text: TEXT.substring(0, 3) + "g" + TEXT.substring(3) })
    })
  })

  describe("When the selection cursor is highlighting part of the text", () => {
    it("Replaces the selected text with the typed character", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type over a selected part of the text
      textBox.setSelectionRange(2, 5)
      userEvent.type(textBox, "g", { initialSelectionStart: 2, initialSelectionEnd: 5 })
      expect(setTextMock).toHaveBeenCalledWith({ change: { changeType: "Other" }, text: TEXT.substring(0, 2) + "g" + TEXT.substring(5) })
    })
  })
})

describe("When \"Tab\" is pressed while in the editor", () => {
  describe("When tab is pressed at the end of the text", () => {
    it("Places a tab character at the end of the text", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type tab at the end
      textBox.setSelectionRange(TEXT.length, TEXT.length)
      fireEvent.keyDown(textBox, { key: "Tab" })
      // Check if a tab has been added to the end of the text
      expect(setTextMock).toHaveBeenCalledWith({
        text: TEXT + "\t",
        change: { changeType: "Tab", changePos: TEXT.length + 1 }
      })
    })
  })

  describe("When tab is pressed at the start of the text", () => {
    it("Places a tab character at the start of the text", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type tab at the end
      textBox.setSelectionRange(0, 0)
      fireEvent.keyDown(textBox, { key: "Tab" })
      // Check if a tab has been added to the start of the text
      expect(setTextMock).toHaveBeenCalledWith({
        text: "\t" + TEXT,
        change: { changeType: "Tab", changePos: 1 }
      })
    })
  })

  describe("When tab is pressed in the middle of the text", () => {
    it("Places a tab character in the middle of the text", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type tab at the end
      textBox.setSelectionRange(3, 3)
      fireEvent.keyDown(textBox, { key: "Tab" })
      // Check if a tab has been added to the middle of the text
      expect(setTextMock).toHaveBeenCalledWith({
        text: TEXT.substring(0, 3) + "\t" + TEXT.substring(3),
        change: { changeType: "Tab", changePos: 4 }
      })
    })
  })

  describe("When the selection cursor is highlighting part of the text", () => {
    it("Replaces the selected text with the tab character", () => {
      setup()
      const textBox = screen.getByRole<HTMLTextAreaElement>("textbox")
      // Type tab at the end
      textBox.setSelectionRange(2, 5)
      fireEvent.keyDown(textBox, { key: "Tab" })
      // Check if a tab has replaced the selected text
      expect(setTextMock).toHaveBeenCalledWith({
        text: TEXT.substring(0, 2) + "\t" + TEXT.substring(5),
        change: { changeType: "Tab", changePos: 3 }
      })
    })
  })
})