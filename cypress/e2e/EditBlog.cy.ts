describe("Creating a new blog", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  function itBehavesLikeWorkingEditorAndLineCounter(editorType: "HTML" | "CSS", txt: string, numLines: number) {
    cy.get(`[data-testid="${editorType}Editor"]`)
      .find("textarea")
      .type(txt, { parseSpecialCharSequences: false })
      .should("have.text", txt)
    cy.get(`[data-testid="${editorType}LineCounter"]`)
      .find("div")
      .should("have.length", numLines)
      .each((counter, idx, lineCounters) => {
        expect(counter).to.contain(`${idx + 1}`)
      })
  }

  describe("HTML editor", () => {
    describe("When typing 1 line of content into the editor", () => {
      const TXT = `<h1>Some Title</h1>`

      it("Displays the content along with one line counter", () => {
        itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 1)
      })
    })

    describe("When typing 5 lines of content into the editor", () => {
      const TXT =
        `<h1>Some Title</h1>
        <article>
          <p>Here is some content</p>
          <p> Here is some more content</p>
        </article>`

      it("Displays all content along with 5 line counters (from 1 to 5)", () => {
        itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 5)
      })
    })

    describe("When typing 30 lines of content into the editor", () => {
      const TXT =
        `<h1>Some Title</h1>
        <article>
          <p>Line 1 content</p>
          <p>Line 2 content</p>
          <p>Line 3 content</p>
          <p>Line 4 content</p>
          <p>Line 5 content</p>
          <p>Line 6 content</p>
          <p>Line 7 content</p>
          <p>Line 8 content</p>
          <p>Line 9 content</p>
          <p>Line 10 content</p>
          <p>Line 11 content</p>
          <p>Line 12 content</p>
          <p>Line 13 content</p>
          <p>Line 14 content</p>
          <p>Line 15 content</p>
          <p>Line 16 content</p>
          <p>Line 17 content</p>
          <p>Line 18 content</p>
          <p>Line 19 content</p>
          <p>Line 20 content</p>
          <p>Line 21 content</p>
          <p>Line 22 content</p>
          <p>Line 23 content</p>
          <p>Line 24 content</p>
          <p>Line 25 content</p>
          <p>Line 26 content</p>
          <p>Line 27 content</p>
        </article>`

      it("Displays the all content along with 30 line counters (from 1 to 30)", () => {
        itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 30)
      })
    })
  })

  describe("CSS editor", () => {
    describe("When typing 1 line of content into the editor", () => {
      const TXT = `p {color: red;}`

      it("Displays the content along with one line counter", () => {
        itBehavesLikeWorkingEditorAndLineCounter("CSS", TXT, 1)
      })
    })

    describe("When typing 5 lines of content into the editor", () => {
      const TXT =
        `p {color: red;}
        body {backgroundColor: blue;}
        article {margin-top: 40px;}
        .someClass {border-radius: 5px;}
        .someOtherClass {display: flex;}`

      it("Displays all content along with 5 line counters (from 1 to 5)", () => {
        itBehavesLikeWorkingEditorAndLineCounter("CSS", TXT, 5)
      })
    })
  })

  describe("Output screen", () => {
    describe("When some HTML and CSS are typed into their respective editors", () => {
      const HTML = "Some Title\n<p>Some paragraph content</p>"
      const CSS = "body {background-color: blue;}\np {color: red;}"

      it("Displays the HTML content and applies the CSS styles", () => {
        // Type content into the editors
        cy.get('[data-testid="HTMLEditor"]')
          .find("textarea")
          .type(HTML, { parseSpecialCharSequences: false })
          .should("have.text", HTML)
        cy.get('[data-testid="CSSEditor"]')
          .find("textarea")
          .type(CSS, { parseSpecialCharSequences: false })
          .should("have.text", CSS)

        // Now ensure the result is displayed correctly in the output
        cy.get('[data-testid="outputWindow"]').invoke("attr", "srcDoc").then((srcDoc) => {
          if (srcDoc) {
            expect(srcDoc.includes(HTML)).to.equal(true)
            expect(srcDoc.includes(CSS)).to.equal(true)
          } else {
            throw new Error("srcDoc is not present on iframe!")
          }
        })
      })
    })
  })

  describe("When clicking the save button", () => {
    const USERNAME = "someUsername"
    const PASSWORD = "s0m3TestPass#%@$"
    const HTML = "<h1>Some Title</h1>\n<p>Some content</p>"
    const CSS = "h1 {color: blue;}\np{color: red;}"
    let blogId: string

    before(() => {
      // Clear database
      cy.clearDb()
      // Create a test user
      cy.signUp(USERNAME, PASSWORD)
    })

    beforeEach(() => {
      cy.intercept("POST", "/blog/create", (req) => {
        // Save the blog id returned in the response for later use
        req.continue((res) => {
          blogId = res.body.success.id
        })
      })

      // Sign the user in
      cy.signIn(USERNAME, PASSWORD)
      // Navigate back to the edit blog page
      cy.visit("/editblog")
    })

    it("Saves the blog content to the database", () => {
      // Type in the blog content
      cy.get('[data-testid="HTMLEditor"]').find("textarea").type(HTML, { parseSpecialCharSequences: false })
      cy.get('[data-testid="CSSEditor"]').find("textarea").type(CSS, { parseSpecialCharSequences: false })
      // Click the save button
      cy.get('[data-testid="saveBtn"]').click()
      // Wait until the loading button is gone
      cy.get('[data-testid="saveBtnLoading"]').should("not.exist").then(() => {
        // Now ensure that the blog has been saved correctly
        cy.verifyBlog(blogId, HTML, CSS)
      })
    })
  })
})

describe("Editing an existing blog", () => {
  const USERNAME = "someUsername"
  const PASSWORD = "s0m3TestPass#%@$"
  const HTML = "<h1>Some Title</h1>\n<p>Some content</p>"
  const CSS = "h1 {color: blue;}\np {color: red;}"
  let blogId: string

  before(() => {
    // Clear the database
    cy.clearDb()
    // Create a test user
    cy.signUp(USERNAME, PASSWORD)

    // Intercept save blog requests to keep track of blog id
    cy.intercept("POST", "/blog/create", (req) => {
      req.continue((res) => {
        blogId = res.body.success.id
      })
    }).as("blogCreation")

    // Create a test blog
    cy.visit("/editblog")
    cy.get('[data-testid="HTMLEditor"]').find("textarea").type(HTML, { parseSpecialCharSequences: false })
    cy.get('[data-testid="CSSEditor"]').find("textarea").type(CSS, { parseSpecialCharSequences: false })
    cy.get('[data-testid="saveBtn"]').click()

    // Ensure the blog is created before moving on
    cy.wait("@blogCreation")
  })

  beforeEach(() => {
    cy.signIn(USERNAME, PASSWORD)
    cy.visit(`/editblog/${blogId}`)
  })

  it("Displays the content of the blog in the editors", () => {
    cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)
    cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)
  })

  it("Saves any changes made to the blog", () => {
    const ADDITIONAL_HTML = "\n<p>And even more content!</p>"
    const ADDITIONAL_CSS = "\nbody {background-color: yellow;}"

    // Make some changes to the blog content
    cy.get('[data-testid="HTMLEditor"]').find("textarea").type(ADDITIONAL_HTML, { parseSpecialCharSequences: false })
    cy.get('[data-testid="CSSEditor"]').find("textarea").type(ADDITIONAL_CSS, { parseSpecialCharSequences: false })
    cy.get('[data-testid="saveBtn"]').click()

    // Ensure saving is done
    cy.get('[data-testid="saveBtnLoading"]').should("not.exist")

    // Now ensure the changes are saved correctly
    cy.verifyBlog(blogId, HTML + ADDITIONAL_HTML, CSS + ADDITIONAL_CSS)
  })
})

export { }