import { CSSProperties, ReactElement } from "react"
import styles from "./AnimatedButton.module.css"
import AnimationProps from "./animation/AnimationProps"

export interface AnimatedButtonProps {
  animation: ReactElement<AnimationProps>,
  text?: string,
  fontSize?: string,
  width?: string,
  height?: string,
  marginTop?: string
}

export default function AnimatedButton({
  animation,
  text,
  fontSize = "14px",
  width = "100px",
  height = "100px",
  marginTop = "0px"
}: AnimatedButtonProps) {
  const buttonStyles: CSSProperties = {
    fontSize: fontSize,
    width: width,
    height: height,
    marginTop: marginTop
  }

  return (
    <button disabled className={styles.button} style={buttonStyles}>
      {animation}
      <div className={styles.text}>{text}</div>
    </button>
  )
}