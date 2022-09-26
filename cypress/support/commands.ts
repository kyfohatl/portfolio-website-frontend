/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      clearDb(): Chainable<void>,
      signUp(username: string, password: string): Chainable<void>,
      waitForAuthCompletion(): Chainable<void>
    }
  }
}

// Clears the database
Cypress.Commands.add("clearDb", () => {
  cy.request({ method: "DELETE", url: `${Cypress.env("backendAddr")}/test/general/clearDb` })
})

// Waits until the sign in or sign up process has completed
Cypress.Commands.add("waitForAuthCompletion", () => {
  // Currently we discern this waiting for redirection to the home page
  // TODO: To be updated once a user profile page is added
  cy.get('[data-testid="heroOuterContainer"]')
})

// Signs up a user with the given username and password
Cypress.Commands.add("signUp", (username: string, password: string) => {
  // Go to the sign up page
  cy.visit("/signup")
  // Type in the username
  cy.get('[data-testid="labelContainerEmail"]').find("input").type(username)
  // Type in the password
  cy.get('[data-testid="labelContainerPassword"]').find("input").type(password)
  // Type in the confirmation password
  cy.get('[data-testid="labelContainerConfirm Password"]').find("input").type(password)
  // Click on the sign up button
  cy.get('[data-testid="signUpBtn"]').click()
  // Wait until sign up is finished and we have redirected to the home page
  cy.waitForAuthCompletion()
})