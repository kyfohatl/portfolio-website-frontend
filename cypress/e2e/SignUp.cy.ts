describe("Regular sign up", () => {
  const USERNAME = "testUser"
  const PASSWORD = "som3Passw0rd#*(&$"

  describe("When a valid username and password are provided", () => {
    before(() => {
      // Clear database
      cy.clearDb()
    })

    // TODO: Once sign up also signs the user in, this should be included in the test
    it("Creates an account for the user and redirects the user to the home page", () => {
      cy.signUp(USERNAME, PASSWORD)
    })
  })

  describe("When invalid credentials are provided", () => {
    beforeEach(() => {
      cy.visit("/signup")
    })

    function enterUsernameAndPass(username: string, password: string, confPass: string) {
      // Type in the username
      if (username) cy.get('[data-testid="labelContainerEmail"]').find("input").type(username)
      // Type in the password
      if (password) cy.get('[data-testid="labelContainerPassword"]').find("input").type(password)
      // Type in the password confirmation
      if (confPass) cy.get('[data-testid="labelContainerConfirm Password"]').find("input").type(confPass)
      // Click the sign up button
      cy.get('[data-testid="signUpBtn"]').click()
    }

    describe("When the username of an existing regular user is provided", () => {
      before(() => {
        // CLear database
        cy.clearDb()
        // Create test user
        cy.signUp(USERNAME, "someOtherPassword32847*($&")
      })

      it("Displays an error on the username field stating that the username exists", () => {
        enterUsernameAndPass(USERNAME, PASSWORD, PASSWORD)
        cy.inputBoxShouldDisplayError("Email", "Email already exists!")
      })
    })

    describe("When the username of an existing third-party user is provided", () => {
      before(() => {
        // CLear database
        cy.clearDb()
        // Create test third party user
        cy.signUpTp(USERNAME, "facebook", "28fbbc37-92f2-4857-8f98-6f0d5e898576")
      })

      it("Displays an error on the username field stating that the email exists", () => {
        enterUsernameAndPass(USERNAME, PASSWORD, PASSWORD)
        cy.inputBoxShouldDisplayError("Email", "Email already exists!")
      })
    })

    describe("When no username is given", () => {
      it("Displays an error on the username field stating that a username is required", () => {
        enterUsernameAndPass("", PASSWORD, PASSWORD)
        cy.inputBoxShouldDisplayError("Email", "A valid email is required!")
      })
    })

    describe("When a username is given, but no password is given", () => {
      it("Displays an error on the password field stating that a valid password is required", () => {
        enterUsernameAndPass(USERNAME, "", "")
        cy.inputBoxShouldDisplayError("Password", "A valid password is required!")
      })
    })

    describe("When username and password are provided, but no confirm password is given", () => {
      it("Displays an error on the confirm password field stating that the passwords must match", () => {
        enterUsernameAndPass(USERNAME, PASSWORD, "")
        cy.inputBoxShouldDisplayError("Confirm Password", "Passwords must match!")
      })
    })

    describe("When a username is given, but the password and confirm password fields do not match", () => {
      it("Displays an error on the confirm password field stating that the passwords must match", () => {
        enterUsernameAndPass(USERNAME, PASSWORD, "someOtherPass2938989058$%*&*")
        cy.inputBoxShouldDisplayError("Confirm Password", "Passwords must match!")
      })
    })
  })
})

export { }