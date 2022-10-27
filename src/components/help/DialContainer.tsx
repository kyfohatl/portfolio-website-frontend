import { useEffect, useState } from "react"
import Dial, { DialProps } from "./Dial"
import { AnimationState } from "./HelpDisplay"
import styles from "./DialContainer.module.css"

export interface DialContainerProps {
  curIndex: number,
  numDials: number,
  animState: AnimationState,
  onClick: (dialIndex: number) => void
}

export const DIAL_GAP = "18px"
export const ACTIVE_DIAL_COLOR = "darkred"
export const DIAL_SIZE = "16px"

export default function DialContainer({ curIndex, numDials, animState, onClick }: DialContainerProps) {
  const [dials, setDials] = useState<JSX.Element[]>([])

  useEffect(() => {
    const newDials = []
    for (let i = 0; i < numDials; i++) {
      let dialProps: DialProps = { show: "normal", dialIndex: i, onClick: onClick }

      if (animState.running) {
        if (i === animState.nextCardInx) dialProps.show = "none"
      } else if (i === curIndex) {
        dialProps.show = "active"
      }

      newDials.push(
        <Dial key={i} {...dialProps} />
      )
    }

    setDials(newDials)
  }, [curIndex, numDials, animState, onClick])

  return (
    <div className={styles.container} style={{ gap: DIAL_GAP }} data-testid="dialContainer">
      {dials}
    </div>
  )
}