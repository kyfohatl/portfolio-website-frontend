import styles from "./Dial.module.css"
import { ACTIVE_DIAL_COLOR, DIAL_SIZE } from "./DialContainer"

export interface DialProps {
  show: "none" | "normal" | "active",
  dialIndex: number,
  onClick: (dialIndex: number) => void
}

export default function Dial({ show, dialIndex, onClick }: DialProps) {
  const DIAL_SIZE_CSS = { height: DIAL_SIZE, width: DIAL_SIZE }

  switch (show) {
    case "normal":
      return (
        <button
          className={styles.dial}
          style={{ ...DIAL_SIZE_CSS }}
          onClick={() => onClick(dialIndex)}
        ></button>
      )
    case "active":
      return (
        <button
          className={styles.dial}
          style={{ ...DIAL_SIZE_CSS, backgroundColor: ACTIVE_DIAL_COLOR }}
          onClick={() => onClick(dialIndex)}
        ></button>
      )
    default:
      // Return an empty placeholder
      return <div style={DIAL_SIZE_CSS}></div>
  }
}