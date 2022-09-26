const USERNAME = "testUser"
const PASSWORD = "s0me!T3st#Pass"

before(() => {
  // Clear the database
  cy.clearDb()
  // Create test user
  cy.signUp(USERNAME, PASSWORD)
})

describe("When a user enters a valid username and password", () => {
  it("Signs the user in and redirects to the home page", () => {
    cy.visit("/signin")
    cy.get('[data-testid="labelContainerEmail"]').find("input").type(USERNAME)
    cy.get('[data-testid="labelContainerPassword"]').find("input").type(PASSWORD)
    cy.get('[data-testid="signInBtn"]').click()
    cy.waitForAuthCompletion()
  })
})

describe("When the user enters a valid username and an invalid password", () => { })

describe("When the user enters an invalid username with some password", () => { })

describe("When the user does not enter anything", () => { })

describe("When the user enters a username without entering a password", () => { })

describe("When the user does not enter a username but enters a password", () => { })

export { }