import Updatable from "../../src/lib/Updatable"
import { TestBlogInfo } from "../../src/tests/lib/api/TestApi"
import Api from "../../src/lib/api/Api"

describe("When there are blogs to show", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "s0m3Password#&^*&"

  const userIdContainer = new Updatable<string>()

  const NUM_BLOGS = 20
  const blogs: TestBlogInfo[] = []

  function itBehavesLikeShowBlogs() { }

  function itBehavesLikeClickOnBlog() { }

  before(() => {
    // Clear the database
    cy.clearDb()
    // Create a test user
    cy.signUp(USERNAME, PASSWORD, userIdContainer).then(async () => {
      // Create some test blogs
      for (let i = 0; i < NUM_BLOGS; i++) {
        blogs.push({
          userId: userIdContainer.getContent(),
          html: `<h1>Blog ${i} Title</h1>\n<p>Blog ${i} content</p>`,
          css: `/* Blog ${i} CSS */\nh1 {color: red;}\np {color: blue;}`
        })
      }

      await Api.test.createBlogs(blogs)
    })
  })

  describe("When signed in", () => {

    beforeEach(() => {
      // Sign in
      cy.signIn(USERNAME, PASSWORD)
    })

    it("Displays the list of blogs, and loads more when scrolling down", () => {
      cy.visit("/viewblogs")
    })

    // it("Displays a \"Create Blog\" button", () => { })
  })

  describe("When signed out", () => { })
})

describe("When there are no blogs to show", () => { })

export { }