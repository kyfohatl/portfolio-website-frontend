import { testViewports } from "../support/helpers/common/utils"

describe("Regular sign in", () => {
  const USERNAME = "testUser"
  const PASSWORD = "s0me!T3st#Pass"

  before(() => {
    // Clear the database
    cy.clearDb()
    // Create test user
    cy.signUp(USERNAME, PASSWORD)
    // Sign out
    cy.signOut()
  })

  beforeEach(() => {
    cy.visit("/signin")
  })

  function enterUsernameAnPass(username: string, password: string) {
    if (username) cy.get('[data-testid="labelContainerEmail"]').find("input").type(username)
    if (password) cy.get('[data-testid="labelContainerPassword"]').find("input").type(password)
    cy.get('[data-testid="signInBtn"]').click()
  }

  describe("When a user enters a valid username and password", () => {
    function sigInAndRedirectToHome() {
      it("Signs the user in and redirects to the home page", () => {
        enterUsernameAnPass(USERNAME, PASSWORD)
        cy.waitForAuthCompletion()
      })
    }

    testViewports(sigInAndRedirectToHome)
  })

  const INCORRECT_CREDENTIALS_TXT = "Username or password is incorrect"

  describe("When the user enters a valid username and an invalid password", () => {
    function showCredentialIncorrect() {
      it("Displays an error stating that either the username or password is incorrect", () => {
        enterUsernameAnPass(USERNAME, "som3Inval1dPa33!!!")
        cy.inputBoxShouldDisplayError("Email", INCORRECT_CREDENTIALS_TXT)
        cy.inputBoxShouldDisplayError("Password", INCORRECT_CREDENTIALS_TXT)
      })
    }

    testViewports(showCredentialIncorrect)
  })

  describe("When the user enters an invalid username with some password", () => {
    function showCredentialIncorrect() {
      it("Displays an error stating that either the username or password is incorrect", () => {
        enterUsernameAnPass("someInvalidUsername", PASSWORD)
        cy.inputBoxShouldDisplayError("Email", INCORRECT_CREDENTIALS_TXT)
        cy.inputBoxShouldDisplayError("Password", INCORRECT_CREDENTIALS_TXT)
      })
    }

    testViewports(showCredentialIncorrect)
  })

  describe("When the user does not enter anything", () => {
    function showUsernameRequired() {
      it("Displays an error stating that a username is required", () => {
        enterUsernameAnPass("", "")
        cy.inputBoxShouldDisplayError("Email", "A valid email is required!")
      })
    }

    testViewports(showUsernameRequired)
  })

  describe("When the user enters a username without entering a password", () => {
    function showPasswordRequired() {
      it("Displays an error stating that a valid password is required", () => {
        enterUsernameAnPass(USERNAME, "")
        cy.inputBoxShouldDisplayError("Password", "A valid password is required!")
      })
    }

    testViewports(showPasswordRequired)
  })

  describe("When the user does not enter a username but enters a password", () => {
    function showUsernameRequired() {
      it("Displays an error stating that a username is required", () => {
        enterUsernameAnPass("", PASSWORD)
        cy.inputBoxShouldDisplayError("Email", "A valid email is required!")
      })
    }

    testViewports(showUsernameRequired)
  })
})

export { }