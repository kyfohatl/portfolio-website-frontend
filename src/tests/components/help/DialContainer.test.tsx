/* eslint-disable jest/no-conditional-expect */
import { render, screen } from "@testing-library/react"
import { DialProps } from "../../../components/help/Dial"
import DialContainer from "../../../components/help/DialContainer"

// Mock the Dial component
jest.mock("../../../components/help/Dial", () => {
  return (dialProps: DialProps) => <div>A Dial! Show: {dialProps.show}</div>
})

const CARD_IDX = 2
const NUM_DIALS = 6
const onClickMock = jest.fn((dialIndex: number) => { })

function itBehavesLikeDisplayAllDials(setup: () => void) {
  it("Displays the number of dials given", () => {
    setup()
    const dials = screen.getAllByText(/a dial!/i)
    expect(dials).toHaveLength(NUM_DIALS)
  })
}

describe("When no animation is running", () => {
  function setup() {
    render(
      <DialContainer animState={{ running: false }} curIndex={CARD_IDX} numDials={NUM_DIALS} onClick={onClickMock} />
    )
  }

  itBehavesLikeDisplayAllDials(setup)

  it("Displays the active dial currently selected dial as \"active\"", () => {
    setup()
    const activeDial = screen.getAllByText(/a dial!/i)[CARD_IDX]
    expect(activeDial).toHaveTextContent(/active/i)
  })

  it("Displays all dials other than the active dial as \"normal\"", () => {
    setup()
    const dials = screen.getAllByText(/a dial!/i)
    for (let i = 0; i < dials.length; i++) {
      if (i === CARD_IDX) {
        expect(dials[i]).not.toHaveTextContent(/normal/i)
      } else {
        expect(dials[i]).toHaveTextContent(/normal/i)
      }
    }
  })
})

describe("When an animation is running", () => {
  const NEXT_CARD_IDX = 4

  function setup() {
    render(
      <DialContainer
        animState={{ running: true, direction: "right", nextCardInx: NEXT_CARD_IDX }}
        curIndex={CARD_IDX}
        numDials={NUM_DIALS}
        onClick={onClickMock}
      />
    )
  }

  itBehavesLikeDisplayAllDials(setup)

  it("Displays the destination dial of the animation as a placeholder", () => {
    setup()
    const placeholder = screen.getAllByText(/a dial!/i)[NEXT_CARD_IDX]
    expect(placeholder).toHaveTextContent(/none/i)
  })

  it("Displays all dials other than the destination dial as \"normal\"", () => {
    setup()
    const dials = screen.getAllByText(/a dial!/i)
    for (let i = 0; i < dials.length; i++) {
      if (i === NEXT_CARD_IDX) {
        expect(dials[i]).not.toHaveTextContent(/normal/i)
      } else {
        expect(dials[i]).toHaveTextContent(/normal/i)
      }
    }
  })
})