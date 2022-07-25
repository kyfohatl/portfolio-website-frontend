import { useEffect, useState } from "react"
import styles from "./HelpDisplayDial.module.css"

interface HelpDisplayDialProps {
  index: number,
  size: number
}

export const DIAL_SIZE = "16px"
const DIAL_SIZE_CSS = { height: DIAL_SIZE, width: DIAL_SIZE }

export default function HelpDisplayDial({ index, size }: HelpDisplayDialProps) {
  const [dials, setDials] = useState<JSX.Element[]>([])

  useEffect(() => {
    const newDials = []
    for (let i = 0; i < size; i++) {
      newDials.push(
        <div
          className={styles.dial}
          {...(i === index ? { style: { backgroundColor: "darkred", ...DIAL_SIZE_CSS } } : { style: DIAL_SIZE_CSS })}
        ></div>
      )
    }

    setDials(newDials)
  }, [index, size])

  return (
    <div className={styles.container}>
      {dials}
    </div>
  )
}