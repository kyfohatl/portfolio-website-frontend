describe("The \"Explore\" button", () => {
  describe("When clicked", () => {
    it("Scrolls the user down past the hero to the content of the page", () => {
      cy.visit("/")
      cy.get('[data-testid="exploreBtn"]').click()
      cy.window().then(function (win) {
        // Ensure that the hero is no longer visible
        cy.get('[data-testid="heroOuterContainer"]').should("not.be.inViewport", win)
      })
    })
  })
})

export { }