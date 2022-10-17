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
import { AuthService } from '../../src/lib/commonTypes'
import Updatable from "../../src/lib/Updatable"

declare global {
  namespace Cypress {
    interface Chainable {
      clearDb(): Chainable<void>,
      waitForAuthCompletion(): Chainable<void>,
      signUp(username: string, password: string, userIdContainer?: Updatable<string>): Chainable<void>,
      signUpTp(username: string, provider: AuthService, providerUserId: string): Chainable<void>,
      signIn(username: string, password: string): Chainable<void>,
      inputBoxShouldDisplayError(type: "Email" | "Password" | "Confirm Password", errTxt: string): Chainable<void>,
      createBlog(html: string, css: string, updatable?: Updatable<string>): Chainable<void>,
      verifyBlog(blogId: string, html: string, css: string): Chainable<void>
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

// Signs up regular a user with the given username and password
// If given an Updatable container, it will fill the container with the returned user id
Cypress.Commands.add("signUp", (username: string, password: string, userIdContainer?: Updatable<string>) => {
  cy.intercept("POST", "/auth/users", (req) => {
    req.continue((res) => {
      if (userIdContainer && "success" in res.body) {
        userIdContainer.update(res.body.success.userId)
      }
    })
  }).as("signUp")

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
  // Wait until sign up is finished
  cy.wait("@signUp")
})

// Signs up a third party user with the given provider, provider id and username
Cypress.Commands.add("signUpTp", (username: string, provider: AuthService, providerUserId: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("backendAddr")}/test/auth/tp_user`,
    body: { username, provider, providerUserId }
  })
})

// Signs in the user with the given username and password (assumes user exists)
Cypress.Commands.add("signIn", (username: string, password: string) => {
  cy.intercept("POST", "/auth/users/login").as("signIn")

  cy.visit("/signin")
  cy.get('[data-testid="labelContainerEmail"]').find("input").type(username)
  cy.get('[data-testid="labelContainerPassword"]').find("input").type(password)
  cy.get('[data-testid="signInBtn"]').click()

  cy.wait("@signIn")
})

// Insures that the given input box type is displaying an error with the correct error message
Cypress.Commands.add(
  "inputBoxShouldDisplayError",
  (type: "Email" | "Password" | "Confirm Password", errTxt: string) => {
    // The input box should have the error class
    cy.get(`[data-testid="labelContainer${type}"]`).find("input").should("have.class", "input-text-box-error")
    // The input box should not have the regular class
    cy.get(`[data-testid="labelContainer${type}"]`).find("input").should("not.have.class", "input-text-box")
    // The input box should display the given error text
    cy.get(`[data-testid="errorLabel${type}"]`).should("contain.text", errTxt)
  }
)

// Creates a blog with the given html and cc. Assumes a user is signed in
Cypress.Commands.add("createBlog", (html: string, css: string, updatable?: Updatable<string>) => {
  cy.intercept("POST", "/blog/create", (req) => {
    req.continue((res) => {
      if (res.statusCode !== 201) throw new Error("Could not create blog!")
      if (updatable) updatable.update(res.body.success.id)
    })
  }).as("createBlog")

  cy.visit("/editblog")
  cy.get('[data-testid="HTMLEditor"]').find("textarea").type(html, { parseSpecialCharSequences: false })
  cy.get('[data-testid="CSSEditor"]').find("textarea").type(css, { parseSpecialCharSequences: false })
  cy.get('[data-testid="saveBtn"]').click()

  cy.wait("@createBlog")
})

Cypress.Commands.add("verifyBlog", (blogId: string, html: string, css: string) => {
  cy.visit(`/blog/${blogId}`)
  cy.get('[data-testid="blogFrame"]').invoke("attr", "srcDoc").should("not.be.undefined").then((srcDoc) => {
    if (!srcDoc) throw new Error("iframe srcDoc is undefined!")

    expect(srcDoc).to.match(new RegExp(html))
    expect(srcDoc).to.match(new RegExp(css))
  })
})