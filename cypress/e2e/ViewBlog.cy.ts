import Updatable from "../../src/lib/Updatable"

describe("When viewing a blog that exists", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "s0m3Password#&^*&"

  const HTML = "<h1>Some Title</h1>\n<p>Some content!</p>"
  const CSS = "h1 {color: red;}\np {color: blue;}"

  const blogIdContainer = new Updatable<string>()

  before(() => {
    // Clear database
    cy.clearDb()
    // Create test user
    cy.signUp(USERNAME, PASSWORD)
    // Create test blog
    cy.createBlog(HTML, CSS, blogIdContainer)
  })

  function itBehavesLikeShowUneditableBlog() {
    it("Displays the content of the blog without showing edit and delete buttons", () => {
      cy.verifyBlog(blogIdContainer.getContent(), HTML, CSS)
      cy.get('[data-testid="editBtn"]').should("not.exist")
      cy.get('[data-testid="deleteBtn"]').should("not.exist")
    })
  }

  describe("When signed out", () => {
    itBehavesLikeShowUneditableBlog()
  })

  describe("When signed in but not as the user that created the blog", () => {
    const USERNAME2 = "someOtherUser"
    const PASSWORD2 = "s0m3OtherPassword#(*&#$&"

    before(() => {
      // Create a second user
      cy.signUp(USERNAME2, PASSWORD2)
    })

    beforeEach(() => {
      // Sign in as the second user, who has not created any blogs
      cy.signIn(USERNAME2, PASSWORD2)
    })

    itBehavesLikeShowUneditableBlog()
  })

  describe("When signed in as the user that created the blog", () => {
    beforeEach(() => {
      // Sign in as the user that created the blog
      cy.signIn(USERNAME, PASSWORD)
    })

    it("Displays the content of the blog, along with edit and delete buttons", () => {
      cy.verifyBlog(blogIdContainer.getContent(), HTML, CSS)
      cy.get('[data-testid="editBtn"]').should("exist")
      cy.get('[data-testid="deleteBtn"]').should("exist")
    })

    describe("When clicking the edit button", () => {
      it("Takes user to the edit blog page with the content of the blog ready to edit", () => {
        cy.visit(`/blog/${blogIdContainer.getContent()}`)
        cy.get('[data-testid="editBtn"]').click()
        cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)
        cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)
      })
    })

    describe("When clicking the delete button", () => { })
  })
})

describe("When viewing a blog that does not exist", () => { })

export { }