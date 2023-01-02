import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
import EditBlog from "../../pages/EditBlog"
import Examples from "../../pages/Examples"
import Home from "../../pages/Home"
import SignIn from "../../pages/SignIn"
import SignUp from "../../pages/SignUp"
import Skills from "../../pages/Skills"
import ViewBlogs from "../../pages/ViewBlogs"
import routes from "../../resources/routes/routes"

// Mock the QuestionMark animation icon as it causes issues due to usage of refs
jest.mock("../../components/animation/QuestionMark", () => {
  return () => <div>Mocked QuestionMark!</div>
})

interface MockNavbarProps {
  init?: string
}

function MockNavbar({ init = "/emptyPage" }: MockNavbarProps) {
  return (
    <MemoryRouter initialEntries={[init]}>
      <Routes>
        <Route path="/emptyPage" element={<Navbar />} />
        <Route path={routes.signIn} element={<SignIn />} />
        <Route path={routes.signUp} element={<SignUp />} />
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.skills} element={<Skills />} />
        <Route path={routes.examples} element={<Examples />} />
        <Route path={routes.viewBlogs} element={<ViewBlogs />} />
        <Route path={routes.editBlog} element={<EditBlog />} />
      </Routes>
    </MemoryRouter>
  )
}

function itBehavesLikeCorrectLink(linkTestId: string, pageTestId: string) {
  // Get the required link
  const link = screen.getByTestId(linkTestId)
  // Click on the link
  fireEvent.click(link)
  // Now check to see if we have been sent to the correct page
  const page = screen.getByTestId(pageTestId)
  expect(page).toBeInTheDocument()
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

  it("Navigates to the sign in page when the sign in button is pressed", () => {
    setup()
    itBehavesLikeCorrectLink("navbarSignInBtn", "signInPage")
  })

  it("Navigates to the sign up page when the sign up button is pressed", () => {
    setup()
    itBehavesLikeCorrectLink("navbarSignUpBtn", "signUpPage")
  })

  it("Navigates to the home page when the home logo is clicked", () => {
    setup()
    itBehavesLikeCorrectLink("homeNavLink", "homePage")
  })

  it("Navigates to the skills page when the Skills link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink("skillsNavLink", "skillsPage")
  })

  it("Navigates to the examples page when the Examples of Work link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink("examplesNavLink", "examplesPage")
  })

  it("Navigates to the view blogs page when the Blogs link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink("viewBlogsNavLink", "viewBlogsPage")
  })

  it("Navigates to the edit blog page when the Create Blog link is clicked", () => {
    setup()
    itBehavesLikeCorrectLink("editBlogNavLink", "editBlogPage")
  })

  describe("When the user is on the same page as a Navbar link, and clicks that link", () => {
    describe("When the user is on the sign in page and clicks the sign in button", () => {
      it("Does nothing", () => {
        render(<MockNavbar init="/signin" />)

        const signInBtn = screen.getByTestId("navbarSignInBtn")
        userEvent.click(signInBtn)

        // Ensure the button did not go into a loading state
        const signInBtnLoading = screen.queryByTestId("navbarSigInBtnLoading")
        expect(signInBtnLoading).not.toBeInTheDocument()

        // Ensure that the sign up button is not disabled
        const signUpBtn = screen.getByTestId("navbarSignUpBtn")
        expect(signUpBtn).not.toHaveAttribute("disabled")

        // Ensure that we did not change pages
        const signInPage = screen.getByTestId("signInPage")
        expect(signInPage).toBeInTheDocument()
      })
    })

    describe("When the user is on the sign up page and clicks the sign up button", () => {
      it("Does nothing", () => {
        render(<MockNavbar init="/signup" />)

        const signUpBtn = screen.getByTestId("navbarSignUpBtn")
        userEvent.click(signUpBtn)

        // Ensure the button did not go into a loading state
        const signUpBtnLoading = screen.queryByTestId("navbarSignUpBtnLoading")
        expect(signUpBtnLoading).not.toBeInTheDocument()

        // Ensure that the sign in button is not disabled
        const signInBtn = screen.getByTestId("navbarSignInBtn")
        expect(signInBtn).not.toHaveAttribute("disabled")

        // Ensure that we did not change pages
        const signUpPage = screen.getByTestId("signUpPage")
        expect(signUpPage).toBeInTheDocument()
      })
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
})