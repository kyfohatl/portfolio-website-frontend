import { render, screen } from "@testing-library/react"
import Error, { getErrorMessage } from "../../components/Error"

function itBehavesLikeCorrectError(errorCode: string) {
  it("Displays the error code in the top heading", () => {
    render(<Error code={errorCode} />)
    const heading = screen.getAllByRole("heading")[0]

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAccessibleName(new RegExp(`Error ${errorCode}`, "i"))
  })

  it("Displays the correct error message after the top heading", () => {
    render(<Error code={errorCode} />)
    const heading = screen.getAllByRole("heading")[1]
    const errorMessage = getErrorMessage(errorCode)

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAccessibleName(errorMessage)
  })

  it("Displays an SVG image", () => {
    render(<Error code={errorCode} />)
    const image = screen.getByTestId("errorImage")

    expect(image).toBeInTheDocument()
  })
}

describe("When given a 500 error code", () => {
  itBehavesLikeCorrectError("500")
})

describe("When given a 404 error code", () => {
  itBehavesLikeCorrectError("404")
})

describe("When given a 403 error code", () => {
  itBehavesLikeCorrectError("403")
})

describe("When given a 401 error code", () => {
  itBehavesLikeCorrectError("401")
})

describe("When given a 400 error code", () => {
  itBehavesLikeCorrectError("400")
})

describe("When given any other error code", () => {
  itBehavesLikeCorrectError("798")
})