// Question: Why is this in a separate file?
// Answer: Because I want to import these into Cypress for my e2e testing, and I can't import anything from the
// file that actually uses these, because that file also uses css modules, and that will break Cypress
// (Some webpack error which I can't be bothered fixing)
export const titles = ["Summarise", "Titles", "Descriptions", "Images", "Tags"]