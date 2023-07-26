import Updatable from "../../src/lib/Updatable"
import { TestBlogInfo } from "../support/commands"
import { NUM_INIT_BLOGS, NUM_ADDITIONAL_BLOGS } from "../../src/resources/ViewBlogsConstants"

function generateHtml(num: number) {
  return `<head>\n<meta property="og:title" content="Blog ${num} Title" />\n</head>\n<body>\n<h1>Blog ${num} Title</h1>\n<p>Blog ${num} content</p>\n</body>`
}

function generateCss(num: number) {
  return `h1 {color: red;}\np {color: blue;}\narticle {margin-top: ${num}px;}`
}

describe("When there are blogs to show", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "s0m3Password#&^*&"

  const userIdContainer = new Updatable<string>()

  const NUM_BLOGS = 20
  const blogs: TestBlogInfo[] = []

  function itBehavesLikeShowBlogs() {
    it("Displays the list of blogs, loads more when scrolling down", () => {
      // Initially a number of blogs are automatically loaded
      cy.get(`[data-testid="blogCard_Blog ${NUM_INIT_BLOGS - 1} Title"]`)
        .find("h2")
        .should("have.text", `Blog ${NUM_INIT_BLOGS - 1} Title`)
      // Wait a little for the page to lead before scrolling, as scrolling immediately seems to break the site sometimes
      cy.wait(1000)
      // Scroll down to load more blogs
      cy.scrollTo(0, "98%").then(() => {
        // Loading indicator should appear to load more blogs
        cy.get('[data-testid="loadingIndicator"]').should("exist")
        // The loading indicator must then disappear and be replaced by new blogs
        cy.get(`[data-testid="blogCard_Blog ${NUM_INIT_BLOGS + NUM_ADDITIONAL_BLOGS - 1} Title"]`)
          .find("h2")
          .should("have.text", `Blog ${NUM_INIT_BLOGS + NUM_ADDITIONAL_BLOGS - 1} Title`)
        cy.get('[data-testid="loadingIndicator"]').should("not.exist")
      })
    })
  }

  function itBehavesLikeClickOnBlog() {
    describe("When a blog card is clicked on", () => {
      it("Takes the client to that blog's page", () => {
        cy.get('[data-testid="blogCard_Blog 1 Title"]').click()
        cy.get('[data-testid="blogFrame"]').invoke("attr", "srcDoc").then((srcDoc) => {
          if (!srcDoc) throw new Error("iframe srcDoc is undefined!")
          expect(srcDoc).to.match(new RegExp(generateHtml(1)))
          expect(srcDoc).to.match(new RegExp(generateCss(1)))
        })
      })
    })
  }

  before(() => {
    // Clear the database
    cy.clearDb()
    // Create a test user
    cy.signUp(USERNAME, PASSWORD, userIdContainer).then(async () => {
      // Create some test blogs
      for (let i = 0; i < NUM_BLOGS; i++) {
        blogs.push({
          userId: userIdContainer.getContent(),
          html: generateHtml(i),
          css: generateCss(i)
        })
      }

      cy.createMultBlogs(blogs)
      cy.signOut()
    })
  })

  describe("When signed in", () => {

    beforeEach(() => {
      // Sign in
      cy.signIn(USERNAME, PASSWORD)
      // Visit the page
      cy.visit("/viewblogs")
    })

    itBehavesLikeShowBlogs()

    itBehavesLikeClickOnBlog()

    describe("Create blog button", () => {
      it("Displays a \"Create Blog\" button, that when clicked on will redirect client to the edit blog page", () => {
        cy.get('[data-testid="createBlogBtn"]').should("exist").click().then(() => {
          cy.get('[data-testid="editBlogPage"]').should("exist")
        })
      })
    })
  })

  describe("When signed out", () => {
    beforeEach(() => {
      cy.visit("/viewblogs")
    })

    itBehavesLikeShowBlogs()

    itBehavesLikeClickOnBlog()

    it("Does not display a \"Create Blog\" button", () => {
      cy.get('[data-testid="createBlogBtn"]').should("not.exist")
    })
  })
})

describe("When there are no blogs to show", () => {
  before(() => {
    // Clear any blogs in the database
    cy.clearDb()
  })

  it("Displays a message stating that there are no blogs to show", () => {
    cy.visit("/viewblogs")
    cy.get('[data-testid="noBlogsTxt"]').should("contain.text", "No blogs to show!")
  })
})

export { }