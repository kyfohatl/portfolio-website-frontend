import { testViewports } from "../support/helpers/common/utils"

describe("Regular sign up", () => {
  const USERNAME = "testUser"
  const PASSWORD = "som3Passw0rd#*(&$"

  describe("When a valid username and password are provided", () => {
    function createAccAndSignIn() {
      it("Creates an account for the user, signs the user in, and redirects the user to the home page", () => {
        cy.signUp(USERNAME, PASSWORD)

        // Ensure the user is signed in
        cy.get('[data-testid="navbarSignOut"]').should("exist")
        cy.get('[data-testid="navbarSignInBtn"]').should("not.exist")
        cy.get('[data-testid="navbarSignUpBtn"]').should("not.exist")

        // Ensure the user is redirected to the home page
        cy.get('[data-testid="homePage"]').should("exist")
      })
    }

    beforeEach(() => {
      // Clear database
      cy.clearDb()
    })

    testViewports(createAccAndSignIn)
  })

  describe("When invalid credentials are provided", () => {
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

    beforeEach(() => {
      cy.visit("/signup")
    })

    describe("When the username of an existing regular user is provided", () => {
      function showUsernameExists() {
        it("Displays an error on the username field stating that the username exists", () => {
          enterUsernameAndPass(USERNAME, PASSWORD, PASSWORD)
          cy.inputBoxShouldDisplayError("Email", "Email already exists!")
        })
      }

      beforeEach(() => {
        // CLear database
        cy.clearDb()
        // Create test user
        cy.signUp(USERNAME, "someOtherPassword32847*($&")
        // Sign out
        cy.signOut()
        // Go back to the sign up page
        cy.visit("/signup")
      })

      testViewports(showUsernameExists)
    })

    describe("When the username of an existing third-party user is provided", () => {
      function showTpUsernameExists() {
        it("Displays an error on the username field stating that the email exists", () => {
          enterUsernameAndPass(USERNAME, PASSWORD, PASSWORD)
          cy.inputBoxShouldDisplayError("Email", "Email already exists!")
        })
      }

      beforeEach(() => {
        // CLear database
        cy.clearDb()
        // Create test third party user
        cy.signUpTp(USERNAME, "facebook", "28fbbc37-92f2-4857-8f98-6f0d5e898576")
      })

      testViewports(showTpUsernameExists)
    })

    describe("When no username is given", () => {
      function showUsernameRequired() {
        it("Displays an error on the username field stating that a username is required", () => {
          enterUsernameAndPass("", PASSWORD, PASSWORD)
          cy.inputBoxShouldDisplayError("Email", "A valid email is required!")
        })
      }

      testViewports(showUsernameRequired)
    })

    describe("When a username is given, but no password is given", () => {
      function showPasswordRequired() {
        it("Displays an error on the password field stating that a valid password is required", () => {
          enterUsernameAndPass(USERNAME, "", "")
          cy.inputBoxShouldDisplayError("Password", "A valid password is required!")
        })
      }

      testViewports(showPasswordRequired)
    })

    describe("When username and password are provided, but no confirm password is given", () => {
      function showPasswordsMismatch() {
        it("Displays an error on the confirm password field stating that the passwords must match", () => {
          enterUsernameAndPass(USERNAME, PASSWORD, "")
          cy.inputBoxShouldDisplayError("Confirm Password", "Passwords must match!")
        })
      }

      testViewports(showPasswordsMismatch)
    })

    describe("When a username is given, but the password and confirm password fields do not match", () => {
      function showPasswordsMismatch() {
        it("Displays an error on the confirm password field stating that the passwords must match", () => {
          enterUsernameAndPass(USERNAME, PASSWORD, "someOtherPass2938989058$%*&*")
          cy.inputBoxShouldDisplayError("Confirm Password", "Passwords must match!")
        })
      }

      testViewports(showPasswordsMismatch)
    })
  })
})

export { }