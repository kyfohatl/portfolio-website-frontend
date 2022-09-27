describe("Regular sign in", () => {
  const USERNAME = "testUser"
  const PASSWORD = "s0me!T3st#Pass"

  before(() => {
    // Clear the database
    cy.clearDb()
    // Create test user
    cy.signUp(USERNAME, PASSWORD)
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
    it("Signs the user in and redirects to the home page", () => {
      enterUsernameAnPass(USERNAME, PASSWORD)
      cy.waitForAuthCompletion()
    })
  })

  function inputBoxShouldDisplayError(type: "Email" | "Password", errTxt: string) {
    // The input box should have the error class
    cy.get(`[data-testid="labelContainer${type}"]`).find("input").should("have.class", "input-text-box-error")
    // The input box should not have the regular class
    cy.get(`[data-testid="labelContainer${type}"]`).find("input").should("not.have.class", "input-text-box")
    // The input box should display the given error text
    cy.get(`[data-testid="errorLabel${type}"]`).should("contain.text", errTxt)
  }

  const INCORRECT_CREDENTIALS_TXT = "Username or password is incorrect"

  describe("When the user enters a valid username and an invalid password", () => {
    it("Displays an error stating that either the username or password is incorrect", () => {
      enterUsernameAnPass(USERNAME, "som3Inval1dPa33!!!")
      inputBoxShouldDisplayError("Email", INCORRECT_CREDENTIALS_TXT)
      inputBoxShouldDisplayError("Password", INCORRECT_CREDENTIALS_TXT)
    })
  })

  describe("When the user enters an invalid username with some password", () => {
    it("Displays an error stating that either the username or password is incorrect", () => {
      enterUsernameAnPass("someInvalidUsername", PASSWORD)
      inputBoxShouldDisplayError("Email", INCORRECT_CREDENTIALS_TXT)
      inputBoxShouldDisplayError("Password", INCORRECT_CREDENTIALS_TXT)
    })
  })

  describe("When the user does not enter anything", () => {
    it("Displays an error stating that a username is required", () => {
      enterUsernameAnPass("", "")
      inputBoxShouldDisplayError("Email", "A valid email is required!")
    })
  })

  describe("When the user enters a username without entering a password", () => {
    it("Displays an error stating that a valid password is required", () => {
      enterUsernameAnPass(USERNAME, "")
      inputBoxShouldDisplayError("Password", "A valid password is required!")
    })
  })

  describe("When the user does not enter a username but enters a password", () => {
    it("Displays an error stating that a username is required", () => {
      enterUsernameAnPass("", PASSWORD)
      inputBoxShouldDisplayError("Email", "A valid email is required!")
    })
  })
})

export { }