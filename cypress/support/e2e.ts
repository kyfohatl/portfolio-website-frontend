// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainer<Subject> {
      (chainer: "be.fullyInViewport", win: Cypress.AUTWindow): Chainable<Subject>,
      (chainer: "not.be.fullyInViewport", win: Cypress.AUTWindow): Chainable<Subject>,
      (chainer: "be.inViewport", win: Cypress.AUTWindow, threshold: number): Chainable<Subject>,
      (chainer: "not.be.inViewport", win: Cypress.AUTWindow, threshold: number): Chainable<Subject>
    }
  }
}

// Asserts if the element is fully visible within the viewport
function isFullyInViewPort(this: Chai.AssertionStatic, win: Cypress.AUTWindow) {
  const element: JQuery = this._obj
  const rect = element[0].getBoundingClientRect()

  const fullHeightInView = rect.top >= 0 && rect.bottom <= win.innerHeight
  const fullWidthInView = rect.left >= 0 && rect.right <= win.innerWidth

  this.assert(
    fullHeightInView && fullWidthInView,
    'expected #{this} to be fully inside the viewport, but it was not',
    'expected #{this} not to be fully inside the viewport',
    win
  )
}

// Asserts if the element is at least partially visible in the viewport based on the given threshold
function isInViewPort(this: Chai.AssertionStatic, win: Cypress.AUTWindow, threshold: number) {
  const element: JQuery = this._obj
  const rect = element[0].getBoundingClientRect()

  // Calculate the area of the intersection between the element's bounding box and the screen
  const rightEdge = Math.min(rect.right, win.innerWidth)
  const leftEdge = Math.max(rect.left, 0)
  const horizontalIntersection = Math.max(0, rightEdge - leftEdge)

  const bottomEdge = Math.min(rect.bottom, win.innerHeight)
  const topEdge = Math.max(rect.top, 0)
  const verticalIntersection = Math.max(0, bottomEdge - topEdge)

  const intersectionArea = horizontalIntersection * verticalIntersection

  // Calculate the area of the element's bounding rectangle
  const rectArea = (rect.right - rect.left) * (rect.bottom - rect.top)

  // Now calculate the proportion of intersection area as a percentage of the total bounding rectangle of the element
  // The result shows what percentage of the element is visible on the screen
  const visiblePercentage = intersectionArea / rectArea

  // Assert that the percentage of the element present on the screen exceeds threshold
  this.assert(
    visiblePercentage >= threshold,
    `expected #{this} to be at least ${threshold * 100}% inside the viewport, but it was only ${visiblePercentage * 100}% inside`,
    `expected #{this} to be less than ${threshold * 100}% inside the viewport, but it was ${visiblePercentage * 100}% inside`,
    win
  )
}

before(() => {
  chai.use((_chai, utils) => {
    _chai.Assertion.addMethod("fullyInViewport", isFullyInViewPort)
    _chai.Assertion.addMethod("inViewport", isInViewPort)
  })
})
