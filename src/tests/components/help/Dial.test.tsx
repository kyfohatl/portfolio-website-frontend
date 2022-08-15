import { fireEvent, render, screen } from "@testing-library/react"
import Dial from "../../../components/help/Dial"
import { ACTIVE_DIAL_COLOR } from "../../../components/help/DialContainer"

const DIAL_IDX = 1
const onClickMock = jest.fn()

beforeEach(() => {
  onClickMock.mockReset().mockImplementation((dialIndex: number) => { })
})

describe("When the given \"show\" property is \"none\"", () => {
  it("Returns an empty placeholder", () => {
    render(<Dial dialIndex={DIAL_IDX} onClick={onClickMock} show="none" />)
    const placeholder = screen.getByTestId("dialPlaceholder")
    const dial = screen.queryByRole("button")

    expect(placeholder).toBeInTheDocument()
    expect(dial).not.toBeInTheDocument()
  })
})

function itBehavesLikeCorrectClick(setup: () => void) {
  it("Calls the onClick function with its dial index when clicked on", () => {
    setup()
    const dial = screen.getByRole("button")
    // Click on the dial
    fireEvent.click(dial)
    // Ensure that onClick was called correctly
    expect(onClickMock).toHaveBeenCalledWith(DIAL_IDX)
  })
}

describe("When the given \"show\" property is \"normal\"", () => {
  function setup() {
    render(<Dial dialIndex={DIAL_IDX} onClick={onClickMock} show="normal" />)
  }

  it("Returns a normal dial without active dial styles", () => {
    setup()
    const dial = screen.getByRole("button")

    expect(dial).toBeInTheDocument()
    expect(dial.style.backgroundColor).not.toBe(ACTIVE_DIAL_COLOR)
  })

  itBehavesLikeCorrectClick(setup)
})

describe("When the given \"show\" property is \"active\"", () => {
  function setup() {
    render(<Dial dialIndex={DIAL_IDX} onClick={onClickMock} show="active" />)
  }

  it("Returns an active dial with active dial styles", () => {
    setup()
    const dial = screen.getByRole("button")

    expect(dial).toBeInTheDocument()
    expect(dial.style.backgroundColor).toBe(ACTIVE_DIAL_COLOR)
  })

  itBehavesLikeCorrectClick(setup)
})