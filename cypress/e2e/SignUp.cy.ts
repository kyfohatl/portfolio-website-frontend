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
    describe("When the username of an existing regular user is provided", () => { })

    describe("When the username of an existing third-party user is provided", () => { })

    describe("When no username is given", () => { })

    describe("When a username is given, but no password is given", () => { })

    describe("When username and password are provided, but no confirm password is given", () => { })

    describe("When a username is given, but the password and confirm password fields do not match", () => { })
  })
})

export { }