import SavingButton from "../components/SavingButton"

function onClick() {
  console.log("You pressed the button")
}

export default function Techstack() {
  return (
    <>
      <p>This is the techstack page</p>
      <SavingButton />
    </>
  )
}