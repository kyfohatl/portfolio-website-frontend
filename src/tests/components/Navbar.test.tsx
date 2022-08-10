import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Navbar from "../../components/Navbar"

function MockNavbar() {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )
}

describe("When the user is not signed in", () => {
  it("Displays two buttons, a sign in button and a sing up button", () => {
    render(<MockNavbar />)
    const signInBtn = screen.getAllByRole("button")[0]
    const signUpBtn = screen.getAllByRole("button")[1]

    expect(signInBtn).toBeInTheDocument()
    expect(signUpBtn).toBeInTheDocument()
    expect(signInBtn).toHaveAccessibleName(/sign in/i)
    expect(signUpBtn).toHaveAccessibleName(/sign up/i)
  })
})

describe("When the user is signed in", () => { })