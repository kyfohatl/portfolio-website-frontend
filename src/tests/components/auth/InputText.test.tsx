import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import InputText from "../../../components/auth/InputText"

const LABEL = "someLabel"
const TEXT = "someText"
const setTextMock = jest.fn((newText: string) => { })

function itBehavesLikeCorrectInput(setup: () => void) {
  it("Displays the given label", () => {
    setup()
    const label = screen.getByText(LABEL)
    expect(label).toBeInTheDocument()
  })

  it("Displays the given text in the input field", () => {
    setup()
    const inputTxt = screen.getByRole("textbox")

    expect(inputTxt).toBeInTheDocument()
    expect(inputTxt).toHaveValue(TEXT)
  })

  it("Calls the given setText function with the new input upon being typed into", () => {
    setup()
    // Get the input element
    const inputTxt = screen.getByRole<HTMLInputElement>("textbox")
    // Type into the input element
    const LETTER = "A"
    userEvent.type(inputTxt, LETTER)
    // Check if the setText function was called correctly
    expect(setTextMock).toHaveBeenCalledWith(TEXT + LETTER)
  })
}

describe("When the error text is an empty string", () => {
  function setup() {
    render(<InputText label={LABEL} text={TEXT} setText={setTextMock} errorText="" />)
  }

  itBehavesLikeCorrectInput(setup)

  it("Has the normal text box class", () => {
    setup()
    const inputTxt = screen.getByRole("textbox")
    expect(inputTxt).toHaveClass("input-text-box")
  })

  it("Does not display the error label", () => {
    setup()
    const errorLabel = screen.queryByTestId("errorLabel")
    expect(errorLabel).not.toBeInTheDocument()
  })
})

describe("When error text is given", () => {
  const ERROR_TXT = "someError"

  function setup() {
    render(<InputText label={LABEL} text={TEXT} setText={setTextMock} errorText={ERROR_TXT} />)
  }

  itBehavesLikeCorrectInput(setup)

  it("Has the error text box class", () => {
    setup()
    const inputTxt = screen.getByRole("textbox")
    expect(inputTxt).toHaveClass("input-text-box-error")
  })

  it("Displays the Error label", () => {
    setup()
    const errorLabel = screen.getByTestId(/errorLabel/)
    expect(errorLabel).toBeInTheDocument()
  })
})