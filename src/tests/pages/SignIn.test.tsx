import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import SignIn from "../../pages/SignIn"

// Mock the navbar
jest.mock("../../components/Navbar", () => {
  return () => <div>Mocked Navbar!</div>
})

// Spy on the Api.signIn method
const signInMock = jest.spyOn(Api, "signIn")

function setup() {
  render(
    <MemoryRouter initialEntries={["/signin"]}>
      <Routes>
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/"} element={<div>Mock Home Page!</div>} />
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
    await screen.findByText("Mock Home Page!")
  }

  describe("When a valid username and password is entered", () => {
    const USERNAME = "someUsername"
    const PASSWORD = "somePassword"
    const USER_ID = "someUserId"

    beforeEach(() => {
      // The Api.signIn method should succeed
      signInMock.mockResolvedValue({ success: { userId: USER_ID } })
    })

    afterAll(() => {
      // Restore the Api.singIn mock
      signInMock.mockRestore()
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
  })

  describe("When both the username and password are missing", () => { })

  describe("When the username is missing but a password is present", () => { })

  describe("When a username is given but the password is missing", () => { })

  describe("When a valid username is given but the given password is invalid", () => { })

  describe("When and invalid username is given with some password", () => { })
})