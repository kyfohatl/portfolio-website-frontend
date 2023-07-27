import { MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT } from "../support/constants/screenSizes"
import testTooltip from "../support/helpers/testTooltip"

beforeEach(() => {
  cy.visit("/")
})

describe("The \"Explore\" button", () => {
  describe("When clicked", () => {
    function clickExploreAndCheckScroll() {
      it("Scrolls the user down past the hero to the content of the page", () => {
        cy.get('[data-testid="exploreBtn"]').click()
        cy.window().then(function (win) {
          // Ensure that the hero is no longer visible
          cy.get('[data-testid="heroOuterContainer"]').should("not.be.inViewport", win, 0.1)
        })
      })
    }

    describe("Desktop", () => {
      clickExploreAndCheckScroll()
    })

    describe("Mobile", () => {
      beforeEach(() => {
        cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
      })

      clickExploreAndCheckScroll()
    })
  })

  describe("When hovering over it", () => {
    it("Displays a tooltip", () => {
      cy.window().then((win) => {
        cy.get('[data-testid="exploreBtnToolTip"]').then((elem) => {
          testTooltip(win, elem, "Click to start the tour!")
        })
      })
    })
  })
})

export { }