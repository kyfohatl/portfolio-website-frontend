import { render, screen } from "@testing-library/react"
import LineCounter from "../../../components/blog/LineCounter"

describe("When given 5 lines", () => {
  const COUNT = 5

  it(`Displays ${COUNT} lines`, () => {
    render(<LineCounter count={COUNT} />)
    const lines = screen.getAllByText(/\d/)

    expect(lines).toHaveLength(COUNT)
    for (let i = 0; i < lines.length; i++) {
      expect(lines[i]).toHaveTextContent(`${i + 1}`)
    }
  })
})

describe("When given 5000 lines", () => {
  const COUNT = 5000

  it(`Displays ${COUNT} lines`, () => {
    render(<LineCounter count={COUNT} />)
    const lines = screen.getAllByText(/\d/)
    expect(lines).toHaveLength(COUNT)
  })
})

describe("When given 0 lines", () => {
  const COUNT = 0

  it(`Does not display any lines`, () => {
    render(<LineCounter count={COUNT} />)
    const lines = screen.queryAllByText(/\d/)
    expect(lines).toHaveLength(0)
  })
})