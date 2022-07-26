import { useEffect, useState } from "react"
import styles from "./HelpDisplayDial.module.css"

interface HelpDisplayDialProps {
  index: number,
  size: number,
  showActiveDial: boolean
}

export const DIAL_GAP = "18px"
export const ACTIVE_DIAL_COLOR = "darkred"
export const DIAL_SIZE = "16px"
const DIAL_SIZE_CSS = { height: DIAL_SIZE, width: DIAL_SIZE }

export default function HelpDisplayDial({ index, size, showActiveDial }: HelpDisplayDialProps) {
  const [dials, setDials] = useState<JSX.Element[]>([])

  useEffect(() => {
    const newDials = []
    for (let i = 0; i < size; i++) {
      newDials.push(
        <div
          className={styles.dial}
          {...(
            i === index && showActiveDial
              ? { style: { backgroundColor: ACTIVE_DIAL_COLOR, ...DIAL_SIZE_CSS } }
              : { style: DIAL_SIZE_CSS }
          )}
        ></div>
      )
    }

    setDials(newDials)
  }, [index, size, showActiveDial])

  return (
    <div className={styles.container} style={{ gap: DIAL_GAP }}>
      {dials}
    </div>
  )
}