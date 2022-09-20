import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import { BackendError } from "../../lib/commonTypes"
import SignIn, { EMAIL_ERR_MSSG, PASS_ERR_MSSG } from "../../pages/SignIn"

// Mock the navbar
jest.mock("../../components/Navbar", () => {
  return () => <div>Mocked Navbar!</div>
})

// Spy on the Api.signIn method
const signInMock = jest.spyOn(Api, "signIn")

// Spy on local storage
const setItemMock = jest.spyOn(Storage.prototype, "setItem")

const HOME_TEXT = "Mock Home Page!"
function setup() {
  render(
    <MemoryRouter initialEntries={["/signin"]}>
      <Routes>
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/"} element={<div>{HOME_TEXT}</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("Regular sign in", () => {
  function enterUsernameAndPass(username?: string, password?: string) {
    setup()

    // Type the username and password into the respective fields
    const usernameInput = screen.getByLabelText("Email")
    const passInput = screen.getByLabelText("Password")

    if (username) userEvent.type(usernameInput, username)
    if (password) userEvent.type(passInput, password)

    // Now click the sign in button
    const signInBtn = screen.getByRole("button", { name: "Sign in" })
    userEvent.click(signInBtn)

    return { signInBtn }
  }

  // Waits until loading is done before allowing unmounting (i.e. we are redirected)
  async function waitForLoadingToFinish() {
    await screen.findByText(HOME_TEXT)
  }

  const USERNAME = "someUsername"
  const PASSWORD = "somePassword"

  describe("When a valid username and password is entered", () => {
    const USER_ID = "someUserId"

    beforeEach(() => {
      // The Api.signIn method should succeed
      signInMock.mockReset().mockResolvedValue({ success: { userId: USER_ID } })
      // Setup locastorage.setItem mock
      setItemMock.mockImplementation((key: string, value: string) => { })
    })

    it("Displays the sign in button in a loading state", async () => {
      const { signInBtn } = enterUsernameAndPass(USERNAME, PASSWORD)

      // Check if the sign in button goes into loading mode
      const loadingBtn = screen.getByRole("button", { name: /loading/i })
      expect(loadingBtn).toBeInTheDocument()
      expect(signInBtn).not.toBeInTheDocument()

      await waitForLoadingToFinish()
    })

    it("Disables the other sign in buttons", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      const otherBtns = screen.getAllByRole<HTMLButtonElement>("button", { name: /sign in/i })

      for (const button of otherBtns) {
        expect(button).toHaveAttribute("disabled")
      }

      await waitForLoadingToFinish()
    })

    it("Sends username and password to the backend", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      expect(signInMock).toHaveBeenCalledWith(USERNAME, PASSWORD)
      await waitForLoadingToFinish()
    })

    it("Saves the returned user id in local storage", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      await waitForLoadingToFinish()
      expect(setItemMock).toHaveBeenCalledWith("userId", USER_ID)
    })

    it("Redirects the user to the home page", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      const homeScreenTxt = await screen.findByText(HOME_TEXT)
      expect(homeScreenTxt).toBeInTheDocument()
    })
  })

  function itBehavesLikeDoesNotSignIn(username?: string, password?: string) {
    it("Does not attempt to sing in the user", () => {
      enterUsernameAndPass(username, password)
      expect(signInMock).not.toHaveBeenCalled()
    })
  }

  describe("When the username is missing", () => {
    it("Displays an error message for the username field", () => {
      enterUsernameAndPass()
      const errorTxt = screen.getByText(EMAIL_ERR_MSSG)
      expect(errorTxt).toBeInTheDocument()
    })

    itBehavesLikeDoesNotSignIn()
  })

  describe("When a username is given but the password is missing", () => {
    it("Displays an error message for the password field", () => {
      enterUsernameAndPass(USERNAME)
      const errorTxt = screen.getByText(PASS_ERR_MSSG)
      expect(errorTxt).toBeInTheDocument()
    })

    itBehavesLikeDoesNotSignIn(USERNAME)
  })

  const INVALID_ENTRY_TXT = "Username or password is incorrect"

  function itBehavesLikeInvalidUsernameOrPassword() {
    it("Indicates that the username or password is incorrect on the username field", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      const usernameInput = await screen.findByTestId("labelContainerEmail")
      const errorLabel = screen.getAllByText(INVALID_ENTRY_TXT)[0]

      expect(usernameInput).toContainElement(errorLabel)
    })

    it("Indicates that the username or password is incorrect on the password field", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      const passwordInput = await screen.findByTestId("labelContainerPassword")
      const errorLabel = screen.getAllByText(INVALID_ENTRY_TXT)[1]

      expect(passwordInput).toContainElement(errorLabel)
    })

    it("Reverts all sign in buttons back to their original, non-disabled state", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)

      // Wait for the api call to finish
      await screen.findAllByText(INVALID_ENTRY_TXT)

      // Ensure sign in buttons are in a normal state
      const signInBtn = screen.getByText("Sign in")
      const thirdPartyBtns = screen.getAllByText(/sign in with/i)
      for (const btn of [signInBtn, ...thirdPartyBtns]) {
        expect(btn).not.toHaveAttribute("disabled")
      }
    })
  }

  describe("When a valid username is given but the given password is invalid", () => {
    beforeEach(() => {
      // Setup the Api.signIn mock to fail the password check
      signInMock.mockReset().mockResolvedValue({
        complexError: { email: INVALID_ENTRY_TXT, password: INVALID_ENTRY_TXT },
        code: 400
      } as BackendError)
    })

    itBehavesLikeInvalidUsernameOrPassword()
  })

  describe("When and invalid username is given with some password", () => {
    beforeEach(() => {
      // Setup the Api.signIn mock to fail the password check
      signInMock.mockReset().mockResolvedValue({
        complexError: { email: INVALID_ENTRY_TXT, password: INVALID_ENTRY_TXT },
        code: 400
      } as BackendError)
    })

    itBehavesLikeInvalidUsernameOrPassword()
  })

  describe("When the given username already exists as a third party account", () => {
    const ALREADY_EXISTS_TXT = "User already exists with third party account"

    beforeEach(() => {
      signInMock.mockReset().mockResolvedValue({
        complexError: { email: ALREADY_EXISTS_TXT, password: "" },
        code: 400
      } as BackendError)
    })

    it("Indicates that the given user already exists as a third party user on the username field", async () => {
      enterUsernameAndPass(USERNAME, PASSWORD)
      const usernameInput = await screen.findByTestId("labelContainerEmail")
      const errorLabel = screen.getByText(ALREADY_EXISTS_TXT)

      expect(usernameInput).toContainElement(errorLabel)
    })
  })
})