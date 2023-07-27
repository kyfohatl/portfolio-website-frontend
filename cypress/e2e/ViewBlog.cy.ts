import Updatable from "../../src/lib/Updatable"
import { VIEWPORT_DIMENSIONS } from "../support/constants/screenSizes"
import { testViewports } from "../support/helpers/common/utils"

function itBehavesLikeBlogDoesNotExists(blogId: string) {
  cy.visit(`/blog/${blogId}`)
  cy.get('[data-testid="errorContainer"]').find("h2").should("have.text", "Error  404")
}

describe("When viewing a blog that exists", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "s0m3Password#&^*&"

  const HTML = "<h1>Some Title</h1>\n<p>Some content!</p>"
  const CSS = "h1 {color: red;}\np {color: blue;}"

  const blogIdContainer = new Updatable<string>()

  // Clears the database, signs up a new user, and then creates a blog with that user
  function signUpAndCreateBlog(idContainer: Updatable<string>) {
    // Clear database
    cy.clearDb()
    // Create test user
    cy.signUp(USERNAME, PASSWORD)
    // Create test blog
    cy.createBlog(HTML, CSS, idContainer)
    // Sign out because for some reason sign in state persists for the first test (not sure why)
    cy.signOut()
  }

  before(() => {
    signUpAndCreateBlog(blogIdContainer)
  })

  function itBehavesLikeShowUneditableBlog() {
    it("Displays the content of the blog without showing edit and delete buttons", () => {
      cy.verifyBlog(blogIdContainer.getContent(), HTML, CSS)
      cy.get('[data-testid="editBtn"]').should("not.exist")
      cy.get('[data-testid="deleteBtn"]').should("not.exist")
    })
  }

  describe("When signed out", () => {
    testViewports(itBehavesLikeShowUneditableBlog)
  })

  describe("When signed in but not as the user that created the blog", () => {
    const USERNAME2 = "someOtherUser"
    const PASSWORD2 = "s0m3OtherPassword#(*&#$&"

    before(() => {
      // Create a second user
      cy.signUp(USERNAME2, PASSWORD2)
      // Sign out
      cy.signOut()
    })

    beforeEach(() => {
      // Sign in as the second user, who has not created any blogs
      cy.signIn(USERNAME2, PASSWORD2)
    })

    afterEach(() => {
      cy.signOut()
    })

    testViewports(itBehavesLikeShowUneditableBlog)
  })

  describe("When signed in as the user that created the blog", () => {
    describe("Desktop", () => {
      beforeEach(() => {
        // Sign in as the user that created the blog
        cy.signIn(USERNAME, PASSWORD)
      })

      it("Displays the content of the blog, along with edit and delete buttons", () => {
        cy.verifyBlog(blogIdContainer.getContent(), HTML, CSS)
        cy.get('[data-testid="editBtn"]').should("exist")
        cy.get('[data-testid="deleteBtn"]').should("exist")
      })
    })

    describe("Mobile", () => {
      beforeEach(() => {
        // Sign in as the user that created the blog
        cy.signIn(USERNAME, PASSWORD)
        // Change viewport size
        cy.viewport(VIEWPORT_DIMENSIONS.mobile.pixelWidth, VIEWPORT_DIMENSIONS.mobile.pixelHeight)
      })

      it("Displays the content of the blog, along with edit and delete buttons", () => {
        cy.verifyBlog(blogIdContainer.getContent(), HTML, CSS)
        cy.get('[data-testid="editBtnMobile"]').should("exist")
        cy.get('[data-testid="deleteBtnMobile"]').should("exist")
      })
    })

    describe("When clicking the edit button", () => {
      beforeEach(() => {
        // Sign in as the user that created the blog
        cy.signIn(USERNAME, PASSWORD)
      })

      describe("Desktop", () => {
        it("Takes user to the edit blog page with the content of the blog ready to edit", () => {
          cy.visit(`/blog/${blogIdContainer.getContent()}`)
          cy.get('[data-testid="editBtn"]').click()
          cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)
          cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)
        })
      })

      describe("Mobile", () => {
        beforeEach(() => {
          cy.viewport(VIEWPORT_DIMENSIONS.mobile.pixelWidth, VIEWPORT_DIMENSIONS.mobile.pixelHeight)
        })

        it("Takes user to the edit blog page with the content of the blog ready to edit", () => {
          cy.visit(`/blog/${blogIdContainer.getContent()}`)
          cy.get('[data-testid="editBtnMobile"]').click()
          cy.get('[data-testid="mobileEditorContainer"]').within(() => {
            // Check the content of the HTML editor
            cy.get('[data-testid="editorTitle_html"]').click()
            cy.get("textarea").should("have.text", HTML)
            // Check the content of the CSS editor
            cy.get('[data-testid="editorTitle_css"]').click()
            cy.get("textarea").should("have.text", CSS)
          })
        })
      })
    })

    describe("When clicking the delete button", () => {
      const sampleBlogIdContainer = new Updatable<string>()

      // Checks that the deletion animation occurs and that the blog has indeed been deleted
      function checkDeletion() {
        // We should see a deletion animation
        cy.get('[data-testid="binLid"]').should("exist")
        // Then we should be sent to the view blogs page
        cy.get('[data-testid="viewBlogsPage"]').should("exist")

        // Ensure that the blog is actually deleted
        itBehavesLikeBlogDoesNotExists(sampleBlogIdContainer.getContent())
      }

      beforeEach(() => {
        // Clear the db, sign up a new user and create a new blog
        signUpAndCreateBlog(sampleBlogIdContainer)
        // Then sign back in as that user
        cy.signIn(USERNAME, PASSWORD)
      })

      describe("Desktop", () => {
        it("Deletes the blog, then displays a deletion animation, and then navigates the client to the view blogs page", () => {
          cy.visit(`/blog/${sampleBlogIdContainer.getContent()}`)
          cy.get('[data-testid="deleteBtn"]').click()
          checkDeletion()
        })
      })

      describe("Mobile", () => {
        beforeEach(() => {
          cy.viewport(VIEWPORT_DIMENSIONS.mobile.pixelWidth, VIEWPORT_DIMENSIONS.mobile.pixelHeight)
        })

        it("Deletes the blog, then displays a deletion animation, and then navigates the client to the view blogs page", () => {
          cy.visit(`/blog/${sampleBlogIdContainer.getContent()}`)
          cy.get('[data-testid="deleteBtnMobile"]').click()
          checkDeletion()
        })
      })
    })
  })
})

describe("When viewing a blog that does not exist", () => {
  function checkErrorOnInvalidBlog() {
    it("Displays a 404 error", () => {
      itBehavesLikeBlogDoesNotExists("72d7b3f9-c60f-4ada-a4b9-940d26a9c8aa")
    })
  }

  testViewports(checkErrorOnInvalidBlog)
})