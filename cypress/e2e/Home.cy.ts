beforeEach(() => {
  cy.visit("/")
})

describe("The \"Explore\" button", () => {
  describe("When clicked", () => {
    it("Scrolls the user down past the hero to the content of the page", () => {
      cy.get('[data-testid="exploreBtn"]').click()
      cy.window().then(function (win) {
        // Ensure that the hero is no longer visible
        cy.get('[data-testid="heroOuterContainer"]').should("not.be.inViewport", win)
      })
    })
  })

  describe("When hovering over it", () => {
    it("Displays a tooltip", () => {
      cy.window().then((win) => {
        cy.get('[data-testid="exploreBtnToolTip"]').then((elem) => {
          const after = win.getComputedStyle(elem[0], "::after")
          // Expect the tooltip to have the correct content
          expect(after.content).to.eq('"Click to start the tour!"')
          // Expect the tooltip to be above the button
          expect(after.top).to.contain("-")
        })
      })
    })
  })
})

export { }