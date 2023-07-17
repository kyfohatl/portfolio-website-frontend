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
      (chainer: "be.inViewport", win: Cypress.AUTWindow): Chainable<Subject>,
      (chainer: "not.be.inViewport", win: Cypress.AUTWindow): Chainable<Subject>
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

// Asserts if the element is at least partially visible in the viewport
function isInViewPort(this: Chai.AssertionStatic, win: Cypress.AUTWindow) {
  const element: JQuery = this._obj
  const rect = element[0].getBoundingClientRect()

  // If the top of the element is somewhere on the screen, then the element must be on the screen height-wise
  // This happens either if the element is fully in the screen, of if the top is on screen, and the bottom is below
  // ehe screen
  const topVisible = rect.top >= 0 && rect.top < win.innerHeight
  // If the bottom of an element is somewhere on the screen, then the element must be on the screen height-wise
  // This happens either if the element is fully in the screen, of if the bottom in on screen, and the top is above
  // the screen
  const bottomVisible = rect.bottom > 0 && rect.bottom <= win.innerHeight
  // Finally, an element could be larger than the screen (height-wise), and thus it's top is above the screen, whilst
  // it's bottom is below the screen, thus fully covering the height of the screen
  const coversScreenH = rect.top <= 0 && rect.bottom >= win.innerHeight

  // The same logic as above goes for the width of the screen
  const leftVisible = rect.left >= 0 && rect.left < win.innerWidth
  const rightVisible = rect.right > 0 && rect.right <= win.innerWidth
  const coversScreenW = rect.left <= 0 && rect.right >= win.innerWidth

  const partialHeightInView = topVisible || bottomVisible || coversScreenH
  const partialWidthInView = leftVisible || rightVisible || coversScreenW

  // For an element to be partially on screen, both it's width and height must be partially present on the screen
  this.assert(
    partialHeightInView && partialWidthInView,
    'expected #{this} to be at least partially inside the viewport, but it was not',
    'expected #{this} to not be visible inside the viewport at all',
    win
  )
}

before(() => {
  chai.use((_chai, utils) => {
    _chai.Assertion.addMethod("fullyInViewport", isFullyInViewPort)
    _chai.Assertion.addMethod("inViewport", isInViewPort)
  })
})
