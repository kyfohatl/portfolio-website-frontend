export default function testTooltip(win: Cypress.AUTWindow, elem: JQuery<HTMLElement>, content: string) {
  const after = win.getComputedStyle(elem[0], "::after")
  // Expect the tooltip to have the correct content
  expect(after.content).to.eq(`"${content}"`)
}