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

// function isInViewPort(_chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
//   function assertIsInViewPort(options: any) {
//     this.assert()
//   }
// }

// chai.use((_chai, utils) => {
//   _chai.Assertion.addMethod("abc", (options) => {
//     const abc: JQuery = this._obj
//   })
// })

declare global {
  namespace Cypress {
    interface Chainer<Subject> {
      (chainer: "be.upperCase"): Chainable<Subject>
    }
  }
}

function isUpperCase(this: Chai.AssertionStatic, expected: string) {
  const element: JQuery = this._obj
  this.assert(
    element.text() === expected.toUpperCase(),
    'expected #{this} to have text #{exp} after upper case, but the text was #{act}',
    'expected #{this} not to have text #{exp} after upper case',
    expected,
    element.text()
  )
}

before(() => {
  chai.use((_chai, utils) => {
    _chai.Assertion.addMethod("upperCase", isUpperCase)
  })
})
