import React from "react"
import { CSSProperties, ReactElement } from "react"
import styles from "./AnimatedButton.module.css"
import AnimationProps from "./animation/AnimationProps"

export interface AnimatedButtonProps {
  animation: ReactElement<AnimationProps>,
  text?: string,
  fontSize?: string,
  width?: string,
  height?: string,
  maxWidth?: string,
  marginTop?: string
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  animation,
  text,
  fontSize = "14px",
  width = "100px",
  height = "100px",
  maxWidth,
  marginTop = "0px"
}, ref) => {
  const buttonStyles: CSSProperties = {
    fontSize: fontSize,
    width: width,
    height: height,
    maxWidth: maxWidth,
    marginTop: marginTop
  }

  return (
    <button disabled className={styles.button} style={buttonStyles}>
      {animation}
      <div className={styles.text}>{text}</div>
    </button>
  )
})

export default AnimatedButton