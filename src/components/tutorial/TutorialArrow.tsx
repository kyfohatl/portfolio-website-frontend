import styles from "./TutorialArrow.module.css"
import { ReactComponent as ArrowIcon } from "../../assets/images/tutorial/arrow.svg"
import { CSSProperties } from "react"

interface TutorialArrowProps {
  left: string,
  top: string,
  rotation: number,
  width: string,
  height: string
}

const MOVEMENT_LENGTH = 30

export default function TutorialArrow({ left, top, rotation, width, height }: TutorialArrowProps) {
  const translateX = MOVEMENT_LENGTH * Math.cos(rotation)
  const translateY = MOVEMENT_LENGTH * Math.sin(rotation)

  return (
    <div
      className={styles.container}
      style={{
        left,
        top,
        "--rotation": `${rotation}deg`,
        "--translateX": translateX + "px",
        "--translateY": translateY + "px"
      } as CSSProperties}
    >
      <ArrowIcon width={width} height={height} />
    </div>
  )
}