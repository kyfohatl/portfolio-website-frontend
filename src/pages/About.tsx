import Button from "../components/Button";
import { ReactComponent as SaveIcon } from "../assets/images/saveIcon.svg"
import Tooltip from "../components/tooltip/Tooltip";

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px", marginLeft: "20px" }}>
      <p>This is the about page!</p>
      <Tooltip text="tooltip!">
        <Button
          type={{ type: "button", callBack: () => { console.log("Hello World!") } }}
          text="hello"
          icon={<SaveIcon width={21} height={21} />}
          disabled={false}
        />
      </Tooltip>
    </div>
  )
}