import { render, screen } from "@testing-library/react"
import LinkBlock from "../../components/LinkBlock"

describe("When given given a list of valid links", () => {
  function itBehavesLikeValidLink(link: HTMLElement, href: string, content: string) {
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", href)
    expect(link).toHaveAccessibleName(content)
  }

  it("Displays them in the order they were given", () => {
    const LINK_HREFS = [
      "http://somerandom1",
      "http://somerandom2",
      "http://somerandom3"
    ]
    const LINK_CONTENTS = [
      "This is link 1",
      "This is link 2",
      "This is link 3"
    ]
    const links = [
      <a key={1} href={LINK_HREFS[0]} target="_blank" rel="noreferrer">{LINK_CONTENTS[0]}</a>,
      <a key={2} href={LINK_HREFS[1]} target="_parent">{LINK_CONTENTS[1]}</a>,
      <a key={3} href={LINK_HREFS[2]}>{LINK_CONTENTS[2]}</a>
    ]

    render(<LinkBlock links={links} />)
    const renderedLinks = screen.getAllByRole("link")

    // Ensure that all 3 links are actually present by iterating explicitly 3 times instead of iterating the 
    // length of the renderedLinks array
    for (let i = 0; i < 3; i++) {
      itBehavesLikeValidLink(renderedLinks[i], LINK_HREFS[i], LINK_CONTENTS[i])
    }
  })
})