describe("The \"Explore\" button", () => {
  describe("When clicked", () => {
    it("Blah", () => {
      cy.visit("/")
      cy.get('[data-testid="heroOuterContainer"]').find("h1").should("be.upperCase", "Ehsan's blog")
    })
  })
})

export { }