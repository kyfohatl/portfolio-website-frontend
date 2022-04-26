import Button from "../components/Button";

function onClick() {
  console.log("You pressed the button")
}

export default function Techstack() {
  return (
    <>
      <p>This is the techstack page</p>
      <Button text="Hello" type={{ type: "button", callBack: onClick }} disabled={true} />
    </>
  )
}