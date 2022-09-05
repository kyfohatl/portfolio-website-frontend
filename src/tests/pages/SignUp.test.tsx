import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import { BackendResponse } from "../../lib/commonTypes"
import SignUp, { EMAIL_ERR_MSSG } from "../../pages/SignUp"

// Mock the navbar
jest.mock("../../components/Navbar", () => {
  return () => <div>Mocked Navbar!</div>
})

// Spy on the Api.signUp method
const signUpMock = jest.spyOn(Api, "signUp")

const HOME_PAGE_TXT = "Home Page Mock!"
function setup() {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<div>{HOME_PAGE_TXT}</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("Regular sign up", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "somePassword"
  const USER_ID = "someUserId"

  function enterUsernameAndPassword(username?: string, password?: string, confPassword?: string) {
    setup()
    const usernameInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confPasswordInput = screen.getByLabelText("Confirm Password")

    // Type the username and password into their respective fields
    if (username) userEvent.type(usernameInput, username)
    if (password) userEvent.type(passwordInput, password)
    if (confPassword) userEvent.type(confPasswordInput, confPassword)

    // Now click the "Sign up" button
    const signUpBtn = screen.getByRole("button", { name: "Sign up" })
    userEvent.click(signUpBtn)

    return { signUpBtn }
  }

  async function waitTillApiRequestIsDone() {
    await screen.findByText(HOME_PAGE_TXT)
  }

  describe("When a valid username, password and confirm password is given", () => {
    beforeEach(() => {
      signUpMock.mockReset().mockResolvedValue({ success: { userId: USER_ID } } as BackendResponse)
    })

    it("Puts the \"Sign up\" button into a loading state", async () => {
      enterUsernameAndPassword(USERNAME, PASSWORD, PASSWORD)
      const loadingBtn = screen.getByRole("button", { name: /loading/i })
      const signUpBtn = screen.queryByRole("button", { name: "Sign up" })

      expect(loadingBtn).toBeInTheDocument()
      expect(signUpBtn).not.toBeInTheDocument()

      await waitTillApiRequestIsDone()
    })

    it("Attempts to sign up the user", async () => {
      enterUsernameAndPassword(USERNAME, PASSWORD, PASSWORD)
      await waitTillApiRequestIsDone()
      expect(signUpMock).toHaveBeenCalledWith(USERNAME, PASSWORD)
    })

    it("Redirects the user to the home page", async () => {
      enterUsernameAndPassword(USERNAME, PASSWORD, PASSWORD)
      const homePageTxt = await screen.findByText(HOME_PAGE_TXT)
      expect(homePageTxt).toBeInTheDocument()
    })
  })

  describe("When no username is given", () => {
    beforeEach(() => {
      signUpMock.mockReset()
    })

    it("Displays an error texts on the username field", () => {
      enterUsernameAndPassword()
      const usernameLabel = screen.getByTestId("labelContainerEmail")
      const usernameErrTxt = screen.getByText(EMAIL_ERR_MSSG)
      expect(usernameLabel).toContainElement(usernameErrTxt)
    })

    it("Does not attempt to send sign up information to the backend", () => {
      enterUsernameAndPassword()
      expect(signUpMock).not.toHaveBeenCalled()
    })
  })

  describe("When a username is given without a password", () => { })

  describe("When a username is given with a password, but without a confirm password", () => { })

  describe("When a username is given, but the password and confirm password do not match", () => { })

  describe("When a valid username is given with an invalid password", () => { })

  describe("When an invalid username is given with some password", () => { })
})

describe("Third party sign up", () => { })