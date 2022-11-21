import { cardTexts } from "../../src/resources/editBlogHelpCards/cardTexts"
import testTooltip from "../support/helpers/testTooltip"

describe("Creating a new blog", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  // Skips the basic tutorial popups displayed on this page
  function skipBasicTute() {
    cy.get('[data-testid="basicHelp"]').find("button").click()
    cy.get('[data-testid="loginHelp"]').find("button").click()
  }

  function itBehavesLikeWorkingEditorAndLineCounter(editorType: "HTML" | "CSS", txt: string, numLines: number) {
    // Close the help popups to prevent interference
    skipBasicTute()

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
        // Close the help popups to prevent interference
        skipBasicTute()

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
      cy.get('[data-testid="basicHelp"]').find("button").click()
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

  // Skips the basic tutorial popup displayed on this page
  function skipBasicTute() {
    cy.get('[data-testid="basicHelp"]').find("button").click()
  }

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
    skipBasicTute()
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

describe("Help display", () => {
  beforeEach(() => {
    cy.visit("/editblog")
  })

  describe("When the help menu is not displaying", () => {
    it("Displays a help button that when clicked on opens the help menu", () => {
      // Initially the help menu should not be shown
      cy.get('[data-testid="helpDisplayOuterContainer"]').should("not.exist")
      // Now click the help button
      cy.get('[data-testid="helpMenuBtn"]').click().then(() => {
        // Now the menu should be displayed
        cy.get('[data-testid="helpDisplayOuterContainer"]').should("exist")
      })
    })
  })

  describe("When the help menu is displaying", () => {
    function waitForAnimationToFinish() {
      // Wait for the transition to complete
      cy.get('[data-testid="animatedDial"]').should("not.exist")
      cy.get('[data-testid="dialPlaceholder"]').should("not.exist")
    }

    function itBehavesLikeShowCurrentCard(idx: number) {
      cy.get(`[data-testid="featureDisplay_${cardTexts[idx].title}"]`).then((card) => {
        // Check the title
        cy.wrap(card).find("h1").should("contain.text", cardTexts[idx].title)
        // Check the notes
        cy.wrap(card).find("ul").then((list) => {
          for (const note of cardTexts[idx].notes) {
            expect(list).to.contain.text(note)
          }
        })
      })
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
      const curIdx = cardTexts.length - 1

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
        cy.get('[data-testid="helpDisplayCloseBtn"]').click().then(() => {
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
        cy.get('[data-testid="basicHelp"]').should("exist").find("button").click().then(() => {
          cy.get('[data-testid="basicHelp"]').should("not.exist")
          cy.get('[data-testid="loginHelp"]').should("not.exist")
        })
      })
    }

    function itBehavesLikeShowBothTutes() {
      it("Displays two basic tutorials, one after the other", () => {
        cy.get('[data-testid="basicHelp"]').should("exist").find("button").click().then(() => {
          cy.get('[data-testid="basicHelp"]').should("not.exist")
          cy.get('[data-testid="loginHelp"]').should("exist")
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
        cy.get('[data-testid="basicHelp"]').find("button").click()
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
          cy.get('[data-testid="basicHelp"]').should("not.exist")
          cy.get('[data-testid="loginHelp"]').should("not.exist")
        })
      }

      beforeEach(() => {
        // Go to the page
        cy.visit("/editblog")
        // Close both tutes and complete the tutorial
        cy.get('[data-testid="basicHelp"]').find("button").click().then(() => {
          cy.get('[data-testid="loginHelp"]').find("button").click()
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
      cy.get('[data-testid="basicHelp"]').should("not.exist")
      cy.get('[data-testid="loginHelp"]').should("not.exist")
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
        cy.get('[data-testid="basicHelp"]').should("exist")

        // Open the help menu an ensure the help popup is not showing
        cy.get('[data-testid="helpMenuBtn"]').click()
        itBehavesLikePopupsNotShowing()

        // Close the help menu, and ensure that the help popup is still not showing
        cy.get('[data-testid="helpDisplayCloseBtn"]').click()
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
          cy.get('[data-testid="basicHelp"]').should("exist")
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
          cy.get('[data-testid="basicHelp"]').should("exist")
          // Press the hotkey
          cy.get("body").type("{esc}")
          // Ensure the second popup is shown
          cy.get('[data-testid="loginHelp"]').should("exist")
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
      cy.get('[data-testid="basicHelp"]').find("button").click()
    })

    describe("When there is content in the HTML editor", () => {
      it("Does not display the popup", () => {
        cy.get('[data-testid="HTMLEditor"]').find("textarea").type("someHtml!")
        cy.get('[data-testid="saveBtn"]').click()
        cy.get('[data-testid="htmlHelp"]').should("not.exist")
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
          cy.get('[data-testid="htmlHelp"]').should("exist")
          // Now close the tutorial using a hotkey
          cy.get("body").type("{esc}")
          cy.get('[data-testid="htmlHelp"]').should("not.exist")
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
          cy.get('[data-testid="htmlHelp"]').find("button").click()
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
        cy.get('[data-testid="htmlHelp"]').should("exist")

        // Open the help menu an ensure the popup is not showing
        cy.get('[data-testid="helpMenuBtn"]').click()
        cy.get('[data-testid="htmlHelp"]').should("not.exist")

        // Close the help menu, and ensure that the popup is still not showing
        cy.get('[data-testid="helpDisplayCloseBtn"]').click()
        cy.get('[data-testid="htmlHelp"]').should("not.exist")
      })
    })
  })
})

export { }