import { render, screen } from "@testing-library/react"
import BlogArticle from "../../components/BlogArticle"

describe("When given a title and some html", () => {
  const TITLE_CONTENT = "someTitle"

  it("Displays the given title", () => {
    render(<BlogArticle title={TITLE_CONTENT}>Some child</BlogArticle>)
    const titleHeader = screen.getByRole("heading")

    expect(titleHeader).toBeInTheDocument()
    expect(titleHeader).toHaveAccessibleName(TITLE_CONTENT)
  })

  it("Display the given html content", () => {
    const HEADING_CONTENT = "Some sample heading"
    const DESC_CONTENT = "Some description paragraph"
    const HTML = (
      <div data-testid="container">
        <h3 data-testid="heading">{HEADING_CONTENT}</h3>
        <p data-testid="description">{DESC_CONTENT}</p>
      </div>
    )

    render(<BlogArticle title={TITLE_CONTENT}>{HTML}</BlogArticle>)
    const article = screen.getByRole("article")
    const container = screen.getByTestId("container")
    const heading = screen.getByTestId("heading")
    const description = screen.getByTestId("description")

    expect(article).toBeInTheDocument()
    expect(container).toBeInTheDocument()
    expect(heading).toHaveAccessibleName(HEADING_CONTENT)
    expect(description).toHaveTextContent(DESC_CONTENT)
  })
})