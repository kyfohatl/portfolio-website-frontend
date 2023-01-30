import Updatable from "../../src/lib/Updatable"
import { titles } from "../../src/resources/editBlogHelpCards/cardTitles"
import { DESKTOP_PIXEL_WIDTH, MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT } from "../support/constants/screenSizes"
import testTooltip from "../support/helpers/testTooltip"
import { EditorType } from "../../src/components/blog/EditorTitle"

function checkMobileEditorFor(editor: EditorType, content: string) {
  cy.get('[data-testid="mobileEditorContainer"]').find(`[data-testid="editorTitle_${editor}"]`).click()
  cy.get('[data-testid="mobileEditor"]').find("textarea").should("have.text", content)
}

function typeIntoMobileEditor(editor: EditorType, content: string) {
  cy.get('[data-testid="mobileEditorContainer"]').find(`[data-testid="editorTitle_${editor}"]`).click()
  cy.get('[data-testid="mobileEditor"]').find("textarea").type(content, { parseSpecialCharSequences: false })
}

describe("Creating a new blog", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  function itBehavesLikeWorkingEditorAndLineCounter(
    editorType: "HTML" | "CSS",
    txt: string,
    numLines: number
  ) {
    function testEditor(mobile: boolean) {
      it(`Displays the content along with ${numLines} line ${numLines > 1 ? "counters" : "counter"}`, () => {
        // Close the help popups to prevent interference
        cy.skipEditBlogTutes()

        let containerTestId = `[data-testid="${editorType}Editor"]`
        if (mobile) containerTestId = '[data-testid="mobileEditor"]'

        cy.get(containerTestId)
          .find("textarea")
          .type(txt, { parseSpecialCharSequences: false })
          .should("have.text", txt)
        cy.get(containerTestId)
          .find(`[data-testid="${mobile ? editorType.toLocaleLowerCase() : editorType}LineCounter"]`)
          .find("div")
          .should("have.length", numLines)
          .each((counter, idx, lineCounters) => {
            expect(counter).to.contain(`${idx + 1}`)
          })
      })
    }

    describe("Desktop", () => {
      testEditor(false)
    })

    describe("Mobile", () => {
      beforeEach(() => {
        cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)

        // Switch over to the correct editor
        cy.get('[data-testid="mobileEditorContainer"]')
          .find(`[data-testid="editorTitle_${editorType.toLocaleLowerCase()}"]`)
          .click()
      })

      testEditor(true)
    })
  }

  describe("HTML editor", () => {
    describe("When typing 1 line of content into the editor", () => {
      const TXT = `<h1>Some Title</h1>`
      itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 1)
    })

    describe("When typing 5 lines of content into the editor", () => {
      const TXT =
        `<h1>Some Title</h1>
        <article>
          <p>Here is some content</p>
          <p> Here is some more content</p>
        </article>`

      itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 5)
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

      itBehavesLikeWorkingEditorAndLineCounter("HTML", TXT, 30)
    })
  })

  describe("CSS editor", () => {
    describe("When typing 1 line of content into the editor", () => {
      const TXT = `p {color: red;}`
      itBehavesLikeWorkingEditorAndLineCounter("CSS", TXT, 1)
    })

    describe("When typing 5 lines of content into the editor", () => {
      const TXT =
        `p {color: red;}
        body {backgroundColor: blue;}
        article {margin-top: 40px;}
        .someClass {border-radius: 5px;}
        .someOtherClass {display: flex;}`

      itBehavesLikeWorkingEditorAndLineCounter("CSS", TXT, 5)
    })
  })

  describe("Output screen", () => {
    describe("When some HTML and CSS are typed into their respective editors", () => {
      const HTML = "Some Title\n<p>Some paragraph content</p>"
      const CSS = "body {background-color: blue;}\np {color: red;}"

      it("Displays the HTML content and applies the CSS styles", () => {
        // Close the help popups to prevent interference
        cy.skipEditBlogTutes()

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
      // Sign out
      cy.signOut()
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
      // Close the help popup to prevent interference
      cy.skipEditBlogTutes()
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

  describe("Page title", () => {
    function itBehavesLikeShowCorrectTitle() {
      it("Displays a page title that indicates a new blog is being created", () => {
        cy.title().should("include", "Create A Blog")
      })
    }

    describe("When there is no unsaved work in local storage", () => {
      itBehavesLikeShowCorrectTitle()
    })

    describe("When there is unsaved work in local storage", () => {
      beforeEach(() => {
        cy.skipEditBlogTutes()
        cy.get('[data-testid="HTMLEditor"]').type("some html")
        cy.get('[data-testid="CSSEditor"]').type("some css")

        // Now go to some other page and come back
        cy.visit("/")
        cy.visit("/editblog")
      })

      itBehavesLikeShowCorrectTitle()
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
    cy.skipEditBlogTutes()
    cy.get('[data-testid="HTMLEditor"]').find("textarea").type(HTML, { parseSpecialCharSequences: false })
    cy.get('[data-testid="CSSEditor"]').find("textarea").type(CSS, { parseSpecialCharSequences: false })
    cy.get('[data-testid="saveBtn"]').click()

    // Ensure the blog is created before moving on
    cy.wait("@blogCreation")
    // Sign out
    cy.signOut()
  })

  beforeEach(() => {
    cy.signIn(USERNAME, PASSWORD)
    cy.visit(`/editblog/${blogId}`)
    cy.skipEditBlogTutes()
  })

  describe("Desktop", () => {
    it("Displays the content of the blog in the desktop editors", () => {
      cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)
      cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)
    })
  })

  describe("Mobile", () => {
    beforeEach(() => {
      cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
    })

    it("Displays the content of the blog in the mobile editor", () => {
      checkMobileEditorFor("html", HTML)
      checkMobileEditorFor("css", CSS)
    })
  })

  describe("Saving changes", () => {
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

  describe("Page title", () => {
    it("Displays a page title that indicates a blog is being edited", () => {
      cy.title().should("include", "Edit Your Blog")
    })
  })
})

describe("Help display", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  describe("When the help menu is not displaying", () => {
    describe("Desktop", () => {
      it("Displays a help button that when clicked on opens the desktop help menu", () => {
        // Initially the help menu should not be shown
        cy.get('[data-testid="helpDisplayOuterContainer"]').should("not.exist")
        // Now click the help button
        cy.get('[data-testid="helpMenuBtn"]').click().then(() => {
          // Now the menu should be displayed
          cy.get('[data-testid="helpDisplayOuterContainer"]').should("exist")
        })
      })
    })

    describe("Mobile", () => {
      beforeEach(() => {
        cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
      })

      it("Displays a help button that when clicked on opens the mobile help menu", () => {
        // Initially the help menu should not be shown
        cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("not.exist")
        // Now click the help button
        cy.get('[data-testid="helpMenuBtn"]').click().then(() => {
          // Now the menu should be displayed
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("exist")
        })
      })
    })
  })

  describe("When the help menu is displaying", () => {
    describe("Desktop", () => {
      function waitForAnimationToFinish() {
        // Wait for the transition to complete
        cy.get('[data-testid="animatedDial"]').should("not.exist")
        cy.get('[data-testid="dialPlaceholder"]').should("not.exist")
      }

      function itBehavesLikeShowCurrentCard(idx: number) {
        cy.get(`[data-testid="featureDisplay_${titles[idx]}"]`).should("exist")
      }

      function itBehavesLikeActiveDialInPos(idx: number) {
        cy.get('[data-testid="dialContainer"]')
          .find("button")
          .eq(idx)
          .invoke("attr", "data-testid")
          .should("eq", "activeDial")
      }

      function itBehavesLikeClickLeftArrow(curIdx: number) {
        describe("When clicking the left arrow button", () => {
          it("Brings in the previous card, and moves the bottom dial one to the left", () => {
            cy.get('[data-testid="helpDisplaySideBtn_left"]').click()
            waitForAnimationToFinish()
            // Ensure the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx - 1)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx - 1)
          })
        })
      }

      function itBehavesLikeClickRightArrow(curIdx: number) {
        describe("When clicking the right arrow button", () => {
          it("Brings in the next card, and moves the bottom dial one to the right", () => {
            cy.get('[data-testid="helpDisplaySideBtn_right"]').click()
            waitForAnimationToFinish()
            // Ensure the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx + 1)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx + 1)
          })
        })
      }

      function itBehavesLikeClickDialToLeft(curIdx: number) {
        describe("When clicking on a dial 2 positions to the left of the current dial", () => {
          it("Moves the stack 2 cards back and the bottom dial moves two positions to the left", () => {
            cy.get('[data-testid="dialContainer"]').find("button").eq(curIdx - 2).click()
            waitForAnimationToFinish()
            // Ensure the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx - 2)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx - 2)
          })
        })
      }

      function itBehavesLikeClickDialToRight(curIdx: number) {
        describe("When clicking on a dial two positions to the right of the current dial", () => {
          it("Moves the stack 2 cards forwards and the bottom dial moves two positions to the right", () => {
            cy.get('[data-testid="dialContainer"]').find("button").eq(curIdx + 2).click()
            waitForAnimationToFinish()
            // Ensure the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx + 2)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx + 2)
          })
        })
      }

      function itBehavesLikePressLeftArrowKey(curIdx: number) {
        describe("When pressing the \"left arrow\" key on the keyboard", () => {
          it("Brings in the previous card, and moves the bottom dial one to the left", () => {
            // To use keyboard shortcuts in Cypress, we can "type" into the document body
            cy.get("body").type("{leftArrow}")
            waitForAnimationToFinish()
            // Ensure that the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx - 1)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx - 1)
          })
        })
      }

      function itBehavesLikePressRightArrowKey(curIdx: number) {
        describe("When pressing the \"right arrow\" key on the keyboard", () => {
          it("Brings in the next card, and moves the bottom dial one to the right", () => {
            // To use keyboard shortcuts in Cypress, we can "type" into the document body
            cy.get("body").type("{rightArrow}")
            waitForAnimationToFinish()
            // Ensure the current card is displayed correctly
            itBehavesLikeShowCurrentCard(curIdx + 1)
            // Ensure the active dial is in the correct spot
            itBehavesLikeActiveDialInPos(curIdx + 1)
          })
        })
      }

      function itBehavesLikeCorrectLeftwardBehavior(curIdx: number) {
        itBehavesLikeClickLeftArrow(curIdx)
        itBehavesLikeClickDialToLeft(curIdx)
        itBehavesLikePressLeftArrowKey(curIdx)
      }

      function itBehavesLikeCorrectRightwardBehavior(curIdx: number) {
        itBehavesLikeClickRightArrow(curIdx)
        itBehavesLikeClickDialToRight(curIdx)
        itBehavesLikePressRightArrowKey(curIdx)
      }

      beforeEach(() => {
        cy.get('[data-testid="helpMenuBtn"]').click()
      })

      describe("When the menu is displaying the first card", () => {
        it("Displays the content of the first help card, along with only a right arrow button, and the bottom dial is at the leftmost position", () => {
          itBehavesLikeShowCurrentCard(0)

          cy.get('[data-testid="helpDisplaySideBtn_right"]').should("exist")
          cy.get('[data-testid="helpDisplaySideBtn_left"]').should("not.exist")

          itBehavesLikeActiveDialInPos(0)
        })

        itBehavesLikeCorrectRightwardBehavior(0)
      })

      describe("When the menu is displaying a middle card", () => {
        beforeEach(() => {
          // Click the right arrow twice to get the the middle of the help card stack
          cy.get('[data-testid="helpDisplaySideBtn_right"]').click().then(() => {
            cy.get('[data-testid="helpDisplaySideBtn_right"]').click()
            waitForAnimationToFinish()
          })
        })

        it("Displays the content of the relevant card, shows both left and right arrow buttons, and the bottom dial is in the middle position", () => {
          itBehavesLikeShowCurrentCard(2)

          cy.get('[data-testid="helpDisplaySideBtn_right"]').should("exist")
          cy.get('[data-testid="helpDisplaySideBtn_left"]').should("exist")

          itBehavesLikeActiveDialInPos(2)
        })

        itBehavesLikeCorrectRightwardBehavior(2)
        itBehavesLikeCorrectLeftwardBehavior(2)
      })

      describe("When the help menu is displaying the final card", () => {
        const curIdx = titles.length - 1

        beforeEach(() => {
          // Click the final dial to go to the last card
          cy.get('[data-testid="dialContainer"]').find("button").last().click()
          waitForAnimationToFinish()
        })

        it("Displays the content of the final card, along with only a right arrow button, and the bottom dial is in the final position", () => {
          itBehavesLikeShowCurrentCard(curIdx)

          cy.get('[data-testid="helpDisplaySideBtn_right"]').should("not.exist")
          cy.get('[data-testid="helpDisplaySideBtn_left"]').should("exist")

          itBehavesLikeActiveDialInPos(curIdx)
        })

        itBehavesLikeCorrectLeftwardBehavior(curIdx)
      })

      describe("When clicking away from the help menu", () => {
        it("Closes the help menu", () => {
          cy.get("body").click(0, 0).then(() => {
            cy.get('[data-testid="helpDisplayOuterContainer"]').should("not.exist")
          })
        })
      })

      describe("When clicking on the \"X\" button", () => {
        it("Closes the help menu", () => {
          cy.get('[data-testid="helpDisplayOuterContainer"]')
            .find('[data-testid="helpDisplayCloseBtn"]')
            .click()
            .then(() => {
              cy.get('[data-testid="helpDisplayOuterContainer"]').should("not.exist")
            })
        })
      })

      describe("When pressing the \"escape\" key", () => {
        it("Closes the help menu", () => {
          cy.get("body").type("{esc}").then(() => {
            cy.get('[data-testid="helpDisplayOuterContainer"]').should("not.exist")
          })
        })
      })

      describe("When clicking on the currently active dial", () => {
        it("Does not change the current card", () => {
          cy.get('[data-testid="dialContainer"]').find("button").first().click().then(() => {
            itBehavesLikeShowCurrentCard(0)
          })
        })
      })
    })

    describe("Mobile", () => {
      beforeEach(() => {
        cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
        cy.get('[data-testid="helpMenuBtn"]').click()
      })

      it("Displays a scrollable container which contains the help cards", () => {
        function cardShouldBeInView(idx: number, win: Cypress.AUTWindow) {
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]')
            .find(`[data-testid="featureDisplay_${titles[idx]}"]`)
            .should("be.inViewport", win)
        }

        function cardShouldNotBeInView(idx: number, win: Cypress.AUTWindow) {
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]')
            .find(`[data-testid="featureDisplay_${titles[idx]}"]`)
            .should("not.be.inViewport", win)
        }

        cy.window().then((win) => {
          // Initially the first card is in view
          cardShouldBeInView(0, win)
          // The middle card should not be in view
          cardShouldNotBeInView(3, win)

          // Now scroll the container to the middle card
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]')
            .find(`[data-testid="featureDisplay_${titles[3]}"]`)
            .scrollIntoView()

          // Now the first card should not be in view
          cardShouldNotBeInView(0, win)
          // And the middle card should be in view
          cardShouldBeInView(3, win)
        })
      })

      describe("When tapping away from the help menu", () => {
        it("Closes the help menu", () => {
          // Initially the menu is shown
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("exist")
          // Click away
          cy.get("body").click(0, 0)
          // Now the menu should not be shown
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("not.exist")
        })
      })

      describe("When tapping the \"X\" button", () => {
        it("Closes the help menu", () => {
          // Initially the menu is shown
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("exist")
          // Click the X button
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').find('[data-testid="helpDisplayCloseBtn"]').click()
          // Now the menu should not be shown
          cy.get('[data-testid="mobileHelpDisplayOuterContainer"]').should("not.exist")
        })
      })
    })
  })
})

describe("Tooltips", () => {
  describe("The help button tooltip", () => {
    beforeEach(() => {
      cy.visit("/editblog")
    })

    it("Displays a tooltip", () => {
      cy.window().then((win) => {
        cy.get('[data-testid="helpTooltip"]').then((elem) => {
          testTooltip(win, elem, "Help")
        })
      })
    })
  })

  describe("The save button tooltip", () => {
    describe("When signed in", () => {
      beforeEach(() => {
        const USERNAME = "someTooltipUsername"
        const PASSWORD = "someTooltipPassword"

        cy.clearDb()
        cy.signUp(USERNAME, PASSWORD)
        cy.visit("/editblog")
      })

      it("Does not display the tooltip", () => {
        cy.get('[data-testid="saveTooltip"]').should("not.exist")
      })
    })

    describe("When not signed in", () => {
      beforeEach(() => {
        cy.visit("/editblog")
      })

      it("Displays a tooltip", () => {
        cy.window().then((win) => {
          cy.get('[data-testid="saveTooltip"]').then((elem) => {
            testTooltip(win, elem, "Sign in to save your work!")
          })
        })
      })
    })
  })
})

describe("Tutorial popups", () => {
  const USERNAME = "somePopupUsername"
  const PASSWORD = "somePopupPassword38923*(*($%*@"

  describe("Basic tutorial", () => {
    function signUpAndGoToEditBlogPage() {
      cy.clearDb()
      cy.signUp(USERNAME, PASSWORD)
      cy.visit("/editblog")
    }

    function itBehavesLikeShowBasicHelp() {
      it("Displays a single tutorial about clicking the button, and does not display the sign in tutorial", () => {
        cy.get('[data-testid="basicHelpDesktop"]').should("exist").find("button").click().then(() => {
          cy.get('[data-testid="basicHelpDesktop"]').should("not.exist")
          cy.get('[data-testid="loginHelpDesktop"]').should("not.exist")
        })
      })
    }

    function itBehavesLikeShowBothTutes() {
      it("Displays two basic tutorials, one after the other", () => {
        cy.get('[data-testid="basicHelpDesktop"]').should("exist").find("button").click().then(() => {
          cy.get('[data-testid="basicHelpDesktop"]').should("not.exist")
          cy.get('[data-testid="loginHelpDesktop"]').should("exist")
        })
      })
    }

    describe("When visiting the page for the first time", () => {
      describe("When signed in", () => {
        beforeEach(() => {
          signUpAndGoToEditBlogPage()
        })

        itBehavesLikeShowBasicHelp()
      })

      describe("When not signed in", () => {
        beforeEach(() => {
          cy.visit("/editblog")
        })

        itBehavesLikeShowBothTutes()
      })
    })

    describe("When visiting the page for a subsequent time, but never having completed the tutorial", () => {
      beforeEach(() => {
        // Go to the page
        cy.visit("/editblog")
        // Close one tute, but not both
        cy.get('[data-testid="basicHelpDesktop"]').find("button").click()
        // Now go to some other page
        cy.visit("/")
      })

      describe("When signed in", () => {
        beforeEach(() => {
          signUpAndGoToEditBlogPage()
        })

        itBehavesLikeShowBasicHelp()
      })

      describe("When not signed in", () => {
        beforeEach(() => {
          cy.visit("/editblog")
        })

        itBehavesLikeShowBothTutes()
      })
    })

    describe("When visiting the page for a subsequent time, and having completed the tutorial previously", () => {
      function itBehavesLikeShowNoTutes() {
        it("Does not display any of the basic tutorial popups", () => {
          cy.get('[data-testid="basicHelpDesktop"]').should("not.exist")
          cy.get('[data-testid="loginHelpDesktop"]').should("not.exist")
        })
      }

      beforeEach(() => {
        // Go to the page
        cy.visit("/editblog")
        // Close both tutes and complete the tutorial
        cy.get('[data-testid="basicHelpDesktop"]').find("button").click().then(() => {
          cy.get('[data-testid="loginHelpDesktop"]').find("button").click()
          // Now go to some other page
          cy.visit("/")
        })
      })

      describe("When signed in", () => {
        beforeEach(() => {
          signUpAndGoToEditBlogPage()
        })

        itBehavesLikeShowNoTutes()
      })

      describe("When not signed in", () => {
        beforeEach(() => {
          cy.visit("/editblog")
        })

        itBehavesLikeShowNoTutes()
      })
    })

    function itBehavesLikePopupsNotShowing() {
      cy.get('[data-testid="basicHelpDesktop"]').should("not.exist")
      cy.get('[data-testid="loginHelpDesktop"]').should("not.exist")
    }

    function itBehavesLikePopupsNeverShow() {
      // Ensure the popups are no longer present
      itBehavesLikePopupsNotShowing()
      // Go to some other page and come back
      cy.visit("/")
      cy.visit("/editblog")
      // Ensure that the popups are still not showing
      itBehavesLikePopupsNotShowing()
    }

    describe("When the tutorial is showing, and the help button is clicked", () => {
      it("Closes the tutorial", () => {
        cy.visit("/editblog")

        // Ensure the help popup is showing at first
        cy.get('[data-testid="basicHelpDesktop"]').should("exist")

        // Open the help menu an ensure the help popup is not showing
        cy.get('[data-testid="helpMenuBtn"]').click()
        itBehavesLikePopupsNotShowing()

        // Close the help menu, and ensure that the help popup is still not showing
        cy.get('[data-testid="helpDisplayOuterContainer"]').find('[data-testid="helpDisplayCloseBtn"]').click()
        itBehavesLikePopupsNotShowing()
      })
    })

    describe("Hotkeys", () => {
      describe("When signed in", () => {
        beforeEach(() => {
          signUpAndGoToEditBlogPage()
        })

        it("Closes the tutorial when the hotkey is pressed, and completes the tutorial", () => {
          // Ensure the popup is present
          cy.get('[data-testid="basicHelpDesktop"]').should("exist")
          // Press the hotkey
          cy.get("body").type("{esc}")
          // Ensure that the popups do not show again
          itBehavesLikePopupsNeverShow()
        })
      })

      describe("When not signed in", () => {
        it("Closes the first popup, then closes the second one when pressed again, and completes the tutorial", () => {
          cy.visit("/editblog")

          // Ensure the popup is present
          cy.get('[data-testid="basicHelpDesktop"]').should("exist")
          // Press the hotkey
          cy.get("body").type("{esc}")
          // Ensure the second popup is shown
          cy.get('[data-testid="loginHelpDesktop"]').should("exist")
          // Press the hotkey again
          cy.get("body").type("{esc}")
          // Ensure that the popups do not show again
          itBehavesLikePopupsNeverShow()
        })
      })
    })
  })

  describe("HTML tutorial", () => {
    beforeEach(() => {
      cy.clearDb()
      cy.signUp(USERNAME, PASSWORD)
      cy.visit("/editblog")
      // Close the basic help popup
      cy.skipEditBlogTutes()
    })

    describe("When there is content in the HTML editor", () => {
      it("Does not display the popup", () => {
        cy.get('[data-testid="HTMLEditor"]').find("textarea").type("someHtml!")
        cy.get('[data-testid="saveBtn"]').click()
        cy.get('[data-testid="htmlHelpDesktop"]').should("not.exist")
      })
    })

    describe("When there is no content in the HTML editor", () => {
      function itBehavesLikeShowHtmlTuteAndCloseWithHotkey() {
        it("Displays the HTML tutorial, and closes it when the appropriate hotkey is pressed", () => {
          // Type something into the css editor
          cy.get('[data-testid="CSSEditor"]').type("someCSS!")
          // Now click the save button
          cy.get('[data-testid="saveBtn"]').click()
          // Ensure the html popup is shown
          cy.get('[data-testid="htmlHelpDesktop"]').should("exist")
          // Now close the tutorial using a hotkey
          cy.get("body").type("{esc}")
          cy.get('[data-testid="htmlHelpDesktop"]').should("not.exist")
        })
      }

      describe("When the user has never seen the popup before", () => {
        itBehavesLikeShowHtmlTuteAndCloseWithHotkey()
      })

      describe("When the user has seen the popup before", () => {
        beforeEach(() => {
          // Trigger the popup once
          cy.get('[data-testid="saveBtn"]').click()
          // Close is to "complete" the html tute
          cy.get('[data-testid="htmlHelpDesktop"]').find("button").click()
          // Go to some other page
          cy.visit("/")
          // Come back to the edit blog page
          cy.visit("/editblog")
        })

        itBehavesLikeShowHtmlTuteAndCloseWithHotkey()
      })
    })

    describe("When the tutorial is showing and the help button is clicked", () => {
      it("Closes the tutorial", () => {
        // Open the html tute
        cy.get('[data-testid="saveBtn"]').click()
        cy.get('[data-testid="htmlHelpDesktop"]').should("exist")

        // Open the help menu an ensure the popup is not showing
        cy.get('[data-testid="helpMenuBtn"]').click()
        cy.get('[data-testid="htmlHelpDesktop"]').should("not.exist")

        // Close the help menu, and ensure that the popup is still not showing
        cy.get('[data-testid="helpDisplayOuterContainer"]').find('[data-testid="helpDisplayCloseBtn"]').click()
        cy.get('[data-testid="htmlHelpDesktop"]').should("not.exist")
      })
    })
  })
})

describe("Unsaved work", () => {
  const USERNAME = "someUnsavedUsername"
  const PASSWORD = "somePassword374#*&^%@"
  const HTML = "some html"
  const CSS = "some css"

  describe("When creating a new blog", () => {
    describe("When adding some unsaved work", () => {
      beforeEach(() => {
        cy.visit("/editblog")
        // Remove tutorial popups
        cy.skipEditBlogTutes()
      })

      describe("Desktop", () => {
        it("Stores the work, and loads it again when going back to create a new blog", () => {
          // Add some work
          cy.get('[data-testid="HTMLEditor"]').find("textarea").type(HTML)
          cy.get('[data-testid="CSSEditor"]').find("textarea").type(CSS)

          // Now go to some other page
          cy.visit("/")

          // Now go back to the edit blog page and see if the unsaved work is loaded in
          cy.visit("/editblog")
          cy.get('[data-testid="HTMLEditor"]').find("textarea").should("contain.text", HTML)
          cy.get('[data-testid="CSSEditor"]').find("textarea").should("contain.text", CSS)
        })
      })

      describe("Mobile", () => {
        beforeEach(() => {
          cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
        })

        it("Stores the work, and loads it again when going back to create a new blog", () => {
          // Add some work
          typeIntoMobileEditor("html", HTML)
          typeIntoMobileEditor("css", CSS)

          // Now go to some other page
          cy.visit("/")

          // Now go back to the edit blog page and see if the unsaved work is loaded in
          cy.visit("/editblog")
          checkMobileEditorFor("html", HTML)
          checkMobileEditorFor("css", CSS)
        })
      })
    })

    describe("When saving the work", () => {
      beforeEach(() => {
        cy.clearDb()
        // Create an account to allow saving of work
        cy.signUp(USERNAME, PASSWORD)
      })

      describe("When adding some work, then saving it", () => {
        describe("Desktop", () => {
          it("Clears any stored work, and will display blank editors when going back to create a new blog", () => {
            // Create a blog and save it
            cy.createBlog(HTML, CSS)
            // Now go to another page
            cy.visit("/")
            // Now come back, and ensure that the editors are blank
            cy.visit("/editblog")
            cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", "")
            cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", "")
          })
        })

        describe("Mobile", () => {
          beforeEach(() => {
            cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
          })

          it("Clears any stored work, and will display blank editors when going back to create a new blog", () => {
            // Create a blog and save it
            cy.createBlog(HTML, CSS)
            // Now go to another page
            cy.visit("/")
            // Now come back, and ensure that the editors are blank
            cy.visit("/editblog")
            checkMobileEditorFor("html", "")
            checkMobileEditorFor("css", "")
          })
        })
      })

      describe("When adding some work, saving it, then adding some more unsaved work", () => {
        describe("Desktop", () => {
          it("Does not store the additional unsaved work, and will not display it when going away and coming back to the edit blog page", () => {
            // Create a blog and save it
            cy.createBlog(HTML, CSS)
            // Now add some more content, but don't save it
            cy.get('[data-testid="HTMLEditor"]').find("textarea").type("some more html")
            cy.get('[data-testid="CSSEditor"]').find("textarea").type("some more css")
            // Go to some other page
            cy.visit("/")
            // Now come back to the edit blog page, and ensure the editors are blank
            cy.visit("/editblog")
            cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", "")
            cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", "")
          })
        })

        describe("Mobile", () => {
          beforeEach(() => {
            cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
          })

          it("Does not store the additional unsaved work, and will not display it when going away and coming back to the edit blog page", () => {
            // Create a blog and save it
            cy.createBlog(HTML, CSS)
            // Now add some more content, but don't save it
            typeIntoMobileEditor("html", "some more html")
            typeIntoMobileEditor("css", "some more css")
            // Go to some other page
            cy.visit("/")
            // Now come back to the edit blog page, and ensure the editors are blank
            cy.visit("/editblog")
            checkMobileEditorFor("html", "")
            checkMobileEditorFor("css", "")
          })
        })
      })
    })
  })

  describe("When editing an existing blog", () => {
    const blogIdContainer = new Updatable<string>()

    beforeEach(() => {
      cy.clearDb()
      // Create a user to allow creation of a blog
      cy.signUp(USERNAME, PASSWORD)
      // Create some blog
      cy.createBlog(HTML, CSS, blogIdContainer)
    })

    describe("Desktop", () => {
      it("Does not store any unsaved work, and will not load it in whether creating a new blog or when trying to edit the same blog again", () => {
        cy.visit(`/editblog/${blogIdContainer.getContent()}`)

        // Make some changes, but don't save them
        cy.get('[data-testid="HTMLEditor"]').find("textarea").type("some additional HTML")
        cy.get('[data-testid="CSSEditor"]').find("textarea").type("some additional CSS")

        // Now go to create a new blog, and ensure that the editors are blank
        cy.visit("/editblog")
        cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", "")
        cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", "")

        // Also go to edit our blog again, and ensure only the original blog content is there
        // (and not any unsaved work)
        cy.visit(`/editblog/${blogIdContainer.getContent()}`)
        cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)
        cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)
      })
    })

    describe("Mobile", () => {
      beforeEach(() => {
        cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
      })

      it("Does not store any unsaved work, and will not load it in whether creating a new blog or when trying to edit the same blog again", () => {
        cy.visit(`/editblog/${blogIdContainer.getContent()}`)

        // Make some changes, but don't save them
        typeIntoMobileEditor("html", "some additional HTML")
        typeIntoMobileEditor("css", "some additional CSS")

        // Now go to create a new blog, and ensure that the editors are blank
        cy.visit("/editblog")
        checkMobileEditorFor("html", "")
        checkMobileEditorFor("css", "")

        // Also go to edit our blog again, and ensure only the original blog content is there
        // (and not any unsaved work)
        cy.visit(`/editblog/${blogIdContainer.getContent()}`)
        checkMobileEditorFor("html", HTML)
        checkMobileEditorFor("css", CSS)
      })
    })
  })
})

describe("Responsiveness specific", () => {
  beforeEach(() => {
    cy.visit("/editblog")
    cy.skipEditBlogTutes()
  })

  it("Shares content between the mobile and desktop editors, and making changes causes changes in the other", () => {
    // Initially both mobile and desktop editors should be empty
    cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", "")
    cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", "")

    cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)

    checkMobileEditorFor("html", "")
    checkMobileEditorFor("css", "")

    // Type something into the html mobile editor and ensure that change is reflected in the desktop html editor
    const HTML = "some html!"
    typeIntoMobileEditor("html", HTML)

    cy.viewport(DESKTOP_PIXEL_WIDTH, PIXEL_HEIGHT)
    cy.get('[data-testid="HTMLEditor"]').find("textarea").should("have.text", HTML)

    // Type something into the html desktop editor and ensure that change is reflected in the mobile html editor
    const ADDITIONAL_HTML = "and some more html!"
    cy.get('[data-testid="HTMLEditor"]').find("textarea").type(ADDITIONAL_HTML)

    cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
    checkMobileEditorFor("html", HTML + ADDITIONAL_HTML)

    // Type something into the mobile css editor and ensure that change is reflected in the desktop css editor
    const CSS = "some css!"
    typeIntoMobileEditor("css", CSS)

    cy.viewport(DESKTOP_PIXEL_WIDTH, PIXEL_HEIGHT)
    cy.get('[data-testid="CSSEditor"]').find("textarea").should("have.text", CSS)

    // Type something into the desktop css editor and ensure that change is reflected in the mobile css editor
    const ADDITIONAL_CSS = "and some more css!"
    cy.get('[data-testid="CSSEditor"]').find("textarea").type(ADDITIONAL_CSS)

    cy.viewport(MOBILE_PIXEL_WIDTH, PIXEL_HEIGHT)
    checkMobileEditorFor("css", CSS + ADDITIONAL_CSS)
  })
})

export { }