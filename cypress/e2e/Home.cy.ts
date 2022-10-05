describe("The \"Explore\" button", () => {
  describe("When clicked", () => {
    it("Blah", () => {
      cy.visit("/")
      cy.get('[data-testid="exploreBtn"]').click()
      cy.window().then(function (win) {
        cy.get('[data-testid="heroOuterContainer"]').should("not.be.inViewport", win)
      })
    })
  })
})

export { }