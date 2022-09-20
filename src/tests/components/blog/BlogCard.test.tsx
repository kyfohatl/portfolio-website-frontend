import { fireEvent, render, screen } from "@testing-library/react"
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom"
import BlogCard from "../../../components/blog/BlogCard"
import MissingImageIcon from "../../../assets/images/noImageIcon.png"

const LINK = "/someLink"
const TITLE = "someTitle"
const DESCRIPTION = "someDescription"
const IMAGE = "someImageLink"
const IMAGE_DESC = "someImageDescription"
const TAGS = ["tag1", "tag2", "tag3"]

describe("When given all required and optional information", () => {
  function setup() {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <BlogCard
                link={LINK}
                title={TITLE}
                description={DESCRIPTION}
                image={IMAGE}
                imageDescription={IMAGE_DESC}
                tags={TAGS}
              />
            }
          />
          <Route path={LINK} element={<div>Some other page</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it("Displays the given image", () => {
    setup()
    const image = screen.getByRole("img")

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", IMAGE)
    expect(image).toHaveAccessibleName(IMAGE_DESC)
  })

  it("Displays the given title", () => {
    setup()
    const title = screen.getByRole("heading")
    expect(title).toHaveTextContent(TITLE)
  })

  it("Displays all given tags", () => {
    setup()
    const tag1 = screen.getByText(TAGS[0])
    const tag2 = screen.getByText(TAGS[1])
    const tag3 = screen.getByText(TAGS[2])

    expect(tag1).toBeInTheDocument()
    expect(tag2).toBeInTheDocument()
    expect(tag3).toBeInTheDocument()
  })

  it("Displays the given description", () => {
    setup()
    const desc = screen.getByText(DESCRIPTION)
    expect(desc).toBeInTheDocument()
  })

  it("Redirects to the given blog link when clicked on", () => {
    setup()
    // Get the link
    const link = screen.getByRole("link")
    // Click on the link
    fireEvent.click(link)
    // Check if we have navigated to the new page
    const newContent = screen.getByText(/some other page/i)
    expect(newContent).toBeInTheDocument()
  })
})

describe("When no image is given", () => {
  it("Displays a placeholder image", () => {
    render(
      <BlogCard
        link={LINK}
        title={TITLE}
        description={DESCRIPTION}
        tags={TAGS}
      />,
      { wrapper: BrowserRouter }
    )
    const image = screen.getByRole("img")

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", MissingImageIcon)
    expect(image).toHaveAccessibleName("Missing")
  })
})

describe("When no tags are given", () => {
  it("Does not show any tag component", () => {
    render(
      <BlogCard
        link={LINK}
        title={TITLE}
        description={DESCRIPTION}
        image={IMAGE}
        imageDescription={IMAGE_DESC}
      />,
      { wrapper: BrowserRouter }
    )
    const tags = screen.queryByTestId("tagContainer")
    expect(tags).not.toBeInTheDocument()
  })
})