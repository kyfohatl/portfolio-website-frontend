describe("Creating a new blog", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  describe("HTML editor", () => {
    describe("When typing 1 line of content into the editor", () => {
      const TXT = `<h1>Some Title</h1>`

      it("Displays the content along with one line counter", () => {
        cy.get('[data-testid="HTMLEditor"]').find("textarea").type(TXT).should("have.text", TXT)
        cy.get('[data-testid="HTMLLineCounter"]').find("div")
          .should("have.length", 1)
          .first().should("contain.text", "1")
      })
    })

    describe("When typing 5 lines of content into the editor", () => {
      const TXT = `<h1>Some Title</h1>
        <article>
          <p>Here is some content</p>
          <p> Here is some more content</p>
        </article>`

      it("Displays all content along with 5 lines", () => {
        cy.get('[data-testid="HTMLEditor"]').find("textarea").type(TXT).should("have.text", TXT)
        cy.get('[data-testid="HTMLLineCounter"]').find("div")
          .should("have.length", 5)
          .each((counter, idx, lineCounters) => {
            // expect(counter).toHaveTextContent(idx + 1)
            cy.log(counter)
          })
      })
    })

    describe("When typing 30 lines of content into the editor", () => { })
  })

  describe("CSS editor", () => { })

  describe("Output screen", () => { })
})

describe("Editing an existing blog", () => { })

export { }