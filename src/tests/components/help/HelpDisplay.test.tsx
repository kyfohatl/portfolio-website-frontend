import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FeatureDisplayCardProps } from "../../../components/FeatureDisplayCard"
import { ACTIVE_DIAL_COLOR } from "../../../components/help/DialContainer"
import HelpDisplay from "../../../components/help/HelpDisplay"

const NOTES = ["note1", "note2", "note3"]
const VISUALS = {
  custom: (
    <div>
      <div data-testid="visual">Visual 1</div>
      <div data-testid="visual">Visual 2</div>
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
  function setup(curIdx: number) {
    render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={curIdx} />)
  }

  function itBehavesLikeCorrectHelpDisplay(curIdx: number) {
    it("Displays the current card title correctly", () => {
      setup(curIdx)
      const curCard = screen.getByRole("heading")
      expect(curCard).toHaveTextContent(new RegExp(`Card${curIdx}`))
    })

    it("Displays the current card notes correctly", () => {
      setup(curIdx)
      const notes = screen.getAllByRole("listitem")
      expect(notes[0]).toHaveTextContent(NOTES[0])
      expect(notes[1]).toHaveTextContent(NOTES[1])
      expect(notes[2]).toHaveTextContent(NOTES[2])
    })

    it("Displays the current card visuals correctly", () => {
      setup(curIdx)
      const visuals = screen.getAllByTestId("visual")
      expect(visuals[0]).toHaveTextContent(/visual 1/i)
      expect(visuals[1]).toHaveTextContent(/visual 2/i)
    })

    it("Displays the correct number of dials", () => {
      setup(curIdx)
      const dials = screen.getAllByTestId(/Dial/)
      expect(dials).toHaveLength(6)
    })

    it("Displays the dials correctly", () => {
      setup(curIdx)
      const dials = screen.getAllByTestId(/Dial/)
      for (let i = 0; i < dials.length; i++) {
        if (i === curIdx) continue
        expect(dials[i].style.backgroundColor).not.toBe(ACTIVE_DIAL_COLOR)
      }
      expect(dials[curIdx].style.backgroundColor).toBe(ACTIVE_DIAL_COLOR)
    })

    it("Calls onClose when the close button is clicked on", () => {
      setup(curIdx)
      const closeBtn = screen.getAllByRole("button")[0]
      fireEvent.click(closeBtn)
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it("Calls onClose when the background is clicked on", () => {
      setup(curIdx)
      const background = screen.getByTestId("helpDisplayBackground")
      fireEvent.click(background)
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it("Calls onClose when the escape key is pressed", () => {
      setup(curIdx)
      userEvent.keyboard("{esc}")
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })
  }

  function itBehavesLikeShowLeftArrow(curIdx: number) {
    it("Displays a \"left\" arrow button", () => {
      setup(curIdx)
      const button = screen.getByText(/chevronLeft/i)
      expect(button).toBeInTheDocument()
    })

    it("Starts the card swipe animation upon pressing the \"left arrow\" key", () => {
      setup(curIdx)
      userEvent.keyboard("{arrowleft}")

      // Both the previous and current cards should now be present in the DOM
      const prevCard = screen.getByText(new RegExp(`Card${curIdx - 1}`))
      const curCard = screen.getByText(new RegExp(`Card${curIdx}`))

      expect(prevCard).toBeInTheDocument()
      expect(curCard).toBeInTheDocument()
    })
  }

  function itBehavesLikeShowRightArrow(curIdx: number) {
    it("Displays a \"right\" arrow button", () => {
      setup(curIdx)
      const button = screen.getByText(/chevronRight/i)
      expect(button).toBeInTheDocument()
    })

    it("Starts the card swipe animation upon pressing the \"right arrow\" key", () => {
      setup(curIdx)
      userEvent.keyboard("{arrowright}")

      // Both the next and current cards should now be present in the DOM
      const nextCard = screen.getByText(new RegExp(`Card${curIdx + 1}`))
      const curCard = screen.getByText(new RegExp(`Card${curIdx}`))

      expect(nextCard).toBeInTheDocument()
      expect(curCard).toBeInTheDocument()
    })
  }

  describe("When the currently displayed card is in the middle of the stack", () => {
    const CUR_IDX = 2
    itBehavesLikeCorrectHelpDisplay(CUR_IDX)
    itBehavesLikeShowLeftArrow(CUR_IDX)
    itBehavesLikeShowRightArrow(CUR_IDX)
  })

  describe("When the currently displayed card is at the top of the stack", () => {
    const CUR_IDX = 0
    itBehavesLikeCorrectHelpDisplay(CUR_IDX)
    itBehavesLikeShowRightArrow(CUR_IDX)

    it("Shows a placeholder instead of the left arrow", () => {
      setup(CUR_IDX)
      const placeholder = screen.getByTestId("hdsb_placeholder")
      const leftBtn = screen.queryByText(/chevronLeft/i)

      expect(placeholder).toBeInTheDocument()
      expect(leftBtn).not.toBeInTheDocument()
    })
  })

  describe("When the currently displayed card is at the bottom of the stack", () => {
    const CUR_IDX = 5
    itBehavesLikeCorrectHelpDisplay(CUR_IDX)
    itBehavesLikeShowLeftArrow(CUR_IDX)

    it("Shows a placeholder instead of the right arrow", () => {
      setup(CUR_IDX)
      const placeholder = screen.getByTestId("hdsb_placeholder")
      const rightBtn = screen.queryByText(/chevronRight/i)

      expect(placeholder).toBeInTheDocument()
      expect(rightBtn).not.toBeInTheDocument()
    })
  })
})

describe("When in an animation state", () => {
  const INIT_IDX = 2

  function itBehavesLikeCorrectCardSwipe(setup: () => void, nextIdx: number) {
    it("Displays the current card", () => {
      setup()
      const curCard = screen.getAllByRole("heading")[1]
      expect(curCard).toHaveTextContent(new RegExp(`Card${INIT_IDX}`))
    })

    it("Displays the next card", () => {
      setup()
      const prevCard = screen.getAllByRole("heading")[0]
      expect(prevCard).toHaveTextContent(new RegExp(`Card${nextIdx}`))
    })

    it("Only displays 2 cards", () => {
      setup()
      const allCards = screen.getAllByRole("heading")
      expect(allCards).toHaveLength(2)
    })

    it("Displays an animated dial", () => {
      setup()
      const animatedDial = screen.getByTestId("animatedDial")
      expect(animatedDial).toBeInTheDocument()
    })

    it("Displays the target dial as a placeholder", () => {
      setup()
      const placeholder = screen.getAllByTestId(/dial/i)[nextIdx]
      expect(placeholder).toHaveAttribute("data-testid", "dialPlaceholder")
    })

    it("Displays all dials other than the target dial and animated dial as normal", () => {
      setup()
      const dials = screen.getAllByTestId(/dial/i)
      for (let i = 0; i < dials.length; i++) {
        // Ignore placeholder and animated dials
        if (i === nextIdx || i === dials.length - 1) continue
        expect(dials[i].style.backgroundColor).not.toBe(ACTIVE_DIAL_COLOR)
      }
    })

    it("Disables the \"left\" and \"right\" buttons", () => {
      setup()
      const leftBtn = screen.getAllByRole("button")[1]
      const rightBtn = screen.getAllByRole("button")[2]

      expect(leftBtn).toHaveAttribute("disabled")
      expect(rightBtn).toHaveAttribute("disabled")
    })
  }

  describe("When the left button is clicked", () => {
    function setup() {
      render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={INIT_IDX} />)
      const leftBtn = screen.getAllByRole("button")[1]
      fireEvent.click(leftBtn)
    }

    itBehavesLikeCorrectCardSwipe(setup, INIT_IDX - 1)
  })

  describe("When the right button is clicked", () => {
    function setup() {
      render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={INIT_IDX} />)
      const rightBtn = screen.getAllByRole("button")[2]
      fireEvent.click(rightBtn)
    }

    itBehavesLikeCorrectCardSwipe(setup, INIT_IDX + 1)
  })

  describe("When another dial other than the active dial is clicked", () => {
    const TARGET_IDX = 4

    function setup() {
      render(<HelpDisplay cardProps={cardProps} onClose={onCloseMock} initIdx={INIT_IDX} />)
      const targetDial = screen.getAllByTestId(/dial/i)[TARGET_IDX]
      fireEvent.click(targetDial)
    }

    itBehavesLikeCorrectCardSwipe(setup, TARGET_IDX)
  })
})