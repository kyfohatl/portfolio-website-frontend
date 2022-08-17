import { fireEvent, render, screen } from "@testing-library/react"
import { FeatureDisplayCardProps } from "../../../components/FeatureDisplayCard"
import DialContainer, { DialContainerProps } from "../../../components/help/DialContainer"
import HelpDisplay from "../../../components/help/HelpDisplay"

// Mock the FeatureDisplayCard component
jest.mock("../../../components/FeatureDisplayCard", () => {
  return (props: FeatureDisplayCardProps) => (
    <div>
      <h1>Display Card</h1>
      <div data-testid="title">{props.title}</div>
      <div data-testdid="notes">{props.notes}</div>
      <div data-testid="visuals">
        {"images" in props.visuals
          ? props.visuals.images
          : props.visuals.custom
        }
      </div>
    </div>
  )
})

// Mock the DialContainer component
jest.mock("../../../components/help/DialContainer", () => {
  return (props: DialContainerProps) => (
    <div>
      <div>Number of dials: {props.numDials}</div>
      <div>Active dial: {props.curIndex}</div>
      <div>Animation state: {props.animState.running + ""}</div>
    </div>
  )
})

const NOTES = ["note1", "note2", "note3"]
const VISUALS = {
  custom: (
    <div>
      <div>Visual 1</div>
      <div>Visual 2</div>
    </div>
  )
}

const cardProps: FeatureDisplayCardProps[] = []
for (let i = 0; i < 6; i++) {
  cardProps.push({ title: "Card" + i, notes: NOTES, visuals: VISUALS })
}

const onCloseMock = jest.fn()
beforeEach(() => {
  onCloseMock.mockReset()
})

describe("When not in an animation state", () => {
  describe("When the currently displayed card is in the middle of the stack", () => {
    function setup() {
      render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={2} />)
    }

    it("Displays the current card correctly", () => {
      setup()
      const card = screen.getByText(/Card2/)
      expect(card).toBeInTheDocument()
    })

    it("Displays the active dial correctly", () => {
      setup()
      const activeDial = screen.getByText(/Active dial:/)
      expect(activeDial).toHaveTextContent(/Active dial: 2/)
    })

    it("Displays the correct number of dials", () => {
      setup()
      const dials = screen.getByText(/Number of dials:/)
      expect(dials).toHaveTextContent(/Number of dials: 6/)
    })

    it("Displays a \"left\" arrow button", () => {
      setup()
      const button = screen.getByText(/chevronLeft/i)
      expect(button).toBeInTheDocument()
    })

    it("Displays a \"right\" arrow button", () => {
      setup()
      const button = screen.getByText(/chevronRight/i)
      expect(button).toBeInTheDocument()
    })

    it("Closes the dialogue when the close button is clicked on", () => { })

    it("Closes the dialogue when the background is clicked on", () => { })
  })

  describe("When the currently displayed card is at the top of the stack", () => { })

  describe("When the currently displayed card is at the bottom of the stack", () => { })
})

describe("When in an animation state", () => {
  const CUR_IDX = 2

  describe("When the left button is clicked", () => {
    function setup() {
      render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={CUR_IDX} />)
      const leftBtn = screen.getAllByRole("button")[1]
      fireEvent.click(leftBtn)
    }

    it("Displays the current card", () => {
      setup()
      const curCard = screen.getByText(new RegExp(`Card${CUR_IDX}`))
      expect(curCard).toBeInTheDocument()
    })

    it("Displays the previous card", () => {
      setup()
      const prevCard = screen.getByText(new RegExp(`Card${CUR_IDX - 1}`))
      expect(prevCard).toBeInTheDocument()
    })

    it("Only displays 2 cards", () => {
      setup()
      const allCards = screen.getAllByText(/Card\d/)
      expect(allCards).toHaveLength(2)
    })

    it("Displays an animated dial", () => {
      setup()
      const animatedDial = screen.getByTestId("animatedDial")
      expect(animatedDial).toBeInTheDocument()
    })
  })

  describe("When the right button is clicked", () => { })
})