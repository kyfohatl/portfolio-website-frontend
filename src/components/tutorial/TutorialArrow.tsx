import styles from "./TutorialArrow.module.css"
import { ReactComponent as ArrowIcon } from "../../assets/images/tutorial/arrow.svg"
import { CSSProperties } from "react"

interface TutorialArrowProps {
  left: string,
  top: string,
  rotation: number,
  width: string,
  height: string,
  movementLength: number
}

export default function TutorialArrow({ left, top, rotation, width, height, movementLength }: TutorialArrowProps) {
  // Since the arrow svg is pointing down by default, to account for this and correct the math, we need to add 90 
  // degrees to the rotation before calculating the translations
  const correctedRotation = rotation + 90
  // We then need to convert degrees to radians since that is what the JS sin and cos functions require
  const rotationRad = correctedRotation * (Math.PI / 180)

  const translateX = movementLength * Math.cos(rotationRad)
  const translateY = movementLength * Math.sin(rotationRad)

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