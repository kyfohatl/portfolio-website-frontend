import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Navbar from "../../components/Navbar"
import EditBlog from "../../pages/EditBlog"
import Examples from "../../pages/Examples"
import Home from "../../pages/Home"
import SignIn from "../../pages/SignIn"
import SignUp from "../../pages/SignUp"
import Skills from "../../pages/Skills"
import ViewBlogs from "../../pages/ViewBlogs"

function MockNavbar() {
  return (
    <MemoryRouter initialEntries={["/emptyPage"]}>
      <Routes>
        <Route path="/emptyPage" element={<Navbar />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/viewblogs" element={<ViewBlogs />} />
        <Route path="/editblog" element={<EditBlog />} />
      </Routes>
    </MemoryRouter>
  )
}

function itBehavesLikeCorrectLink(linkIdx: number, newPageTest: () => void) {
  // Get the required link
  const link = screen.getAllByRole("link")[linkIdx]
  // Click on the link
  fireEvent.click(link)
  // Now check to see if we have been sent to the correct page
  newPageTest()
}

function setup() {
  render(<MockNavbar />)
}

describe("When the user is not signed in", () => {
  beforeAll(() => {
    // Mock the browser local storage
    Storage.prototype.getItem = (key: string) => null
  })

  it("Displays a sign in button", () => {
    setup()
    const signInBtn = screen.getAllByRole("button")[0]

    expect(signInBtn).toBeInTheDocument()
    expect(signInBtn).toHaveAccessibleName(/sign in/i)
  })

  it("Displays a sign up button just after the sign in button", () => {
    setup()
    const signUpBtn = screen.getAllByRole("button")[1]

    expect(signUpBtn).toBeInTheDocument()
    expect(signUpBtn).toHaveAccessibleName(/sign up/i)
  })

  function makeNewPageTest(headingIdx: number, headingTxt: RegExp) {
    return function newPageTest() {
      const heading = screen.getAllByRole("heading")[headingIdx]
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveAccessibleName(headingTxt)
    }
  }

  it("Navigates to the sign in page when the sign in button is pressed", () => {
    // Run any necessary setup
    setup()
    // The sign in button should be the second last link on the navbar
    const linkIdx = screen.getAllByRole("link").length - 2
    // The Sign In page should have a "Sign In" heading at the top of the page
    const headingIdx = 0
    // now run the tests
    itBehavesLikeCorrectLink(linkIdx, makeNewPageTest(headingIdx, /sign in/i))
  })

  it("Navigates to the sign up page when the sign up button is pressed", () => {
    // Run any necessary setup
    setup()
    // The sign up button should be the last link on the navbar
    const linkIdx = screen.getAllByRole("link").length - 1
    // The Sign Up page should have a "Sign Up" heading at the top of the page
    const headingIdx = 0
    // now run the tests
    itBehavesLikeCorrectLink(linkIdx, makeNewPageTest(headingIdx, /sign up/i))
  })

  it("Navigates to the home page when the home logo is clicked", () => {
    // Run any necessary setup
    setup()
    // The home logo should be first icon/link on the navbar
    const linkIdx = 0
    // The home page should have the author's name at the top
    const headingIdx = 0
    // Now run the tests
    itBehavesLikeCorrectLink(linkIdx, makeNewPageTest(headingIdx, /ehsan/i))
  })

  it("Navigates to the skills page when the Skills link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink(2, makeNewPageTest(0, /education/i))
  })

  it("Navigates to the examples page when the Examples of Work link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink(3, makeNewPageTest(0, /catalog/i))
  })

  it("Navigates to the view blogs page when the Blogs link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink(4, () => {
      const blogsPage = screen.getByTestId("viewBlogsPage")
      expect(blogsPage).toBeInTheDocument()
    })
  })
})

describe("When the user is signed in", () => {
  beforeAll(() => {
    // Mock browser local storage
    Storage.prototype.getItem = (key: string) => "someUserId"
  })

  it("Displays a Sign Out button", () => {
    setup()
    const signOutBtn = screen.getByRole("button")
    expect(signOutBtn).toBeInTheDocument()
    expect(signOutBtn).toHaveAccessibleName(/sign out/i)
  })

  it("Does not display Sign In and Sign Up buttons", () => {
    setup()
    const signInBtn = screen.queryByRole("button", { name: /sign in/i })
    const signUpBtn = screen.queryByRole("button", { name: /sign up/i })

    expect(signInBtn).not.toBeInTheDocument()
    expect(signUpBtn).not.toBeInTheDocument()
  })

  it("Displays a \"Create A New Blog\" link which takes the user to the Edit Blog page", () => {
    setup()
    // Ensure link is present
    const createBlogLink = screen.getByRole("link", { name: /create a new blog/i })
    expect(createBlogLink).toBeInTheDocument()

    // Click on the link
    fireEvent.click(createBlogLink)

    // Check if we have been redirected to the Edit Blog page
    const htmlEditor = screen.getByText(/HTML/)
    const cssEditor = screen.getByText(/CSS/)
    expect(htmlEditor).toBeInTheDocument()
    expect(cssEditor).toBeInTheDocument()
  })
})