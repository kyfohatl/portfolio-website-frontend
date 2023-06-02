import { render, screen } from "@testing-library/react"
import { FeatureDisplayCardProps } from "../../../components/FeatureDisplayCard"
import AnimatedCard from "../../../components/help/AnimatedCard"

// Mock the FeatureDisplayCard component
jest.mock("../../../components/FeatureDisplayCard", () => {
  return () => <div>Feature Display Card!</div>
})

const CARD_PROPS: FeatureDisplayCardProps = {
  title: "someTitle",
  notes: ["note 1", "note 2"],
  visuals: { desktop: { custom: <div>Some visual</div> }, mobile: { custom: <div>Some visual</div> } }
}
const DURATION = "1s"

describe("When the card type is outgoing and direction is left", () => {
  it("Has the base, outgoing and slideR css classes", () => {
    render(<AnimatedCard cardProps={CARD_PROPS} duration={DURATION} type="outgoing" direction="left" />)
    const container = screen.getByTestId("animatedCardContainer")
    expect(container).toHaveClass("base", "outgoingCard", "outgoingSlideR")
  })
})

describe("When the card type is outgoing and direction is right", () => {
  it("Has the base, outgoing and slideL css classes", () => {
    render(<AnimatedCard cardProps={CARD_PROPS} duration={DURATION} type="outgoing" direction="right" />)
    const container = screen.getByTestId("animatedCardContainer")
    expect(container).toHaveClass("base", "outgoingCard", "outgoingSlideL")
  })
})

describe("When the card type is incoming and direction is left", () => {
  it("Has the base, incomingL and slideR css classes", () => {
    render(<AnimatedCard cardProps={CARD_PROPS} duration={DURATION} type="incoming" direction="left" />)
    const container = screen.getByTestId("animatedCardContainer")
    expect(container).toHaveClass("base", "incomingCardL", "incomingSlideR")
  })
})

describe("When the card type is incoming and direction is right", () => {
  it("Has the base, incomingR and slideL css classes", () => {
    render(<AnimatedCard cardProps={CARD_PROPS} duration={DURATION} type="incoming" direction="right" />)
    const container = screen.getByTestId("animatedCardContainer")
    expect(container).toHaveClass("base", "incomingCardR", "incomingSlideL")
  })
})