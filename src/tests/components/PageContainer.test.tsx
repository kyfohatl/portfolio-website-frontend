import { render, screen } from "@testing-library/react"
import PageContainer from "../../components/PageContainer"

// Mock the navbar
jest.mock("../../components/Navbar", () => {
  return () => <div data-testid="navbarMock">Navbar!</div>
})

// Mock the loading component
jest.mock("../../components/Loading", () => {
  return () => <div data-testid="loadingMock">Loading!</div>
})

// Mock the error component
jest.mock("../../components/Error", () => {
  return (props: { code: string }) => <div data-testid="errorMock">Error: {props.code}</div>
})

const CHILDREN = (
  <div data-testid="childrenContainer">
    <h1 data-testid="childHeading">Child Heading</h1>
    <p data-testid="childText">Some child paragraph</p>
  </div>
)

// Ensures that the navbar is shown
function itBehavesLikeShowNavbar(setup: () => void) {
  it("Displays the navbar", () => {
    setup()
    const navbar = screen.getByTestId("navbarMock")
    expect(navbar).toBeInTheDocument()
    expect(navbar.textContent).toMatch(/navbar!/i)
  })
}

describe("Page title", () => {
  it("Sets the page title to the given title", () => {
    const TITLE = "Some Test Title"
    render(<PageContainer title={TITLE}>{CHILDREN}</PageContainer>)
    expect(document.title.includes(TITLE)).toBe(true)
  })
})

describe("When the page is in the normal state", () => {
  function setup() {
    render(<PageContainer title="" state={{ status: "normal" }}>{CHILDREN}</PageContainer>)
  }

  itBehavesLikeShowNavbar(setup)

  it("Displays child content", () => {
    setup()
    const container = screen.getByTestId("childrenContainer")
    const heading = screen.getByTestId("childHeading")
    const text = screen.getByTestId("childText")

    expect(container).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(text).toBeInTheDocument()
  })

  it("Does not display Loading and Error components", () => {
    setup()
    const loading = screen.queryByTestId("loadingMock")
    const error = screen.queryByTestId("errorMock")

    expect(loading).not.toBeInTheDocument()
    expect(error).not.toBeInTheDocument()
  })
})

describe("When the page is in the loading state", () => {
  function setup() {
    render(<PageContainer title="" state={{ status: "loading" }}>{CHILDREN}</PageContainer>)
  }

  it("Displays the Loading component", () => {
    setup()
    const loading = screen.getByTestId("loadingMock")
    expect(loading).toBeInTheDocument()
  })

  it("Does not display the navbar and child content", () => {
    setup()
    const navbar = screen.queryByTestId("navbarMock")
    const error = screen.queryByTestId("errorMock")

    expect(navbar).not.toBeInTheDocument()
    expect(error).not.toBeInTheDocument()
  })
})

describe("When the page is in the error state", () => {
  const ERROR_CODE = "403"

  function setup() {
    render(<PageContainer title="" state={{ status: "Error", errorCode: ERROR_CODE }}>{CHILDREN}</PageContainer>)
  }

  itBehavesLikeShowNavbar(setup)

  it("Does not display the Loading component, nor any child content", () => {
    setup()
    const loading = screen.queryByTestId("loadingMock")
    const childDiv = screen.queryByTestId("childrenContainer")

    expect(loading).not.toBeInTheDocument()
    expect(childDiv).not.toBeInTheDocument()
  })
})