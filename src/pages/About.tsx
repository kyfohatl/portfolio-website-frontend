import Button from "../components/Button";

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px", marginLeft: "20px" }}>
      <p>This is the about page!</p>
      <Button type={{ type: "button", callBack: () => { console.log("YOYOYO") } }} text="hello" disabled />
    </div>
  )
}