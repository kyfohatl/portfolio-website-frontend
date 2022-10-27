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

  const partialHeightInView = rect.bottom > 0 && rect.top < win.innerHeight
  const partialWidthInView = rect.right > 0 && rect.left < win.innerWidth

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
