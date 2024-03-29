import styles from "./Button.module.css"

import React, { ReactElement } from "react"
import LoadingButton from "./LoadingButton"
import AnimatedButton from "./AnimatedButton"
import AnimationProps from "./animation/AnimationProps"

export type ButtonState =
  { state: "normal" } |
  { state: "loading" } |
  { state: "animated", animation: ReactElement<AnimationProps>, text: string }

// A callback button must come with a callback function
interface CallBackButton {
  type: "button",
  callBack: () => void
}

// A submit type button does not need a callback function
interface SubmitButton {
  type: "submit",
  callBack?: () => void
}

type ButtonType = CallBackButton | SubmitButton

export interface ButtonProps {
  text?: string,
  type: ButtonType,
  backgroundColor?: string,
  fontSize?: string,
  color?: string,
  width?: string,
  height?: string,
  maxWidth?: string,
  marginTop?: string,
  padding?: string,
  icon?: React.ReactNode,
  buttonState?: ButtonState,
  disabled?: boolean,
  borderRadius?: string,
  boxShadow?: string,
  btnTestId?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  text,
  type,
  backgroundColor = "#8B0000",
  fontSize = "14px",
  color = "#FFFFFF",
  width = "100px",
  height = "100px",
  maxWidth,
  marginTop = "0px",
  padding,
  icon,
  buttonState = { state: "normal" },
  disabled = false,
  borderRadius,
  boxShadow,
  btnTestId
}, ref) => {
  let buttonStyles: React.CSSProperties = {
    fontSize: fontSize,
    width: width,
    height: height,
    maxWidth: maxWidth,
    marginTop: marginTop,
    ...(padding && { padding: padding }),
    ...(borderRadius && { borderRadius: borderRadius }),
    ...(boxShadow && { boxShadow: boxShadow })
  }

  // Only add color and background color if not disabled as otherwise they override the disabled selector
  // css styling
  if (!disabled) {
    buttonStyles.backgroundColor = backgroundColor
    buttonStyles.color = color
  }

  let button = <button
    data-testid={btnTestId}
    className={disabled ? styles.button : styles.button + " " + styles.activeBtn}
    type={type.type}
    style={buttonStyles}
    disabled={disabled}
    {...(type.callBack ? { onClick: type.callBack } : {})}
    ref={ref}
  >
    {icon}
    {text}
  </button>

  if (buttonState.state === "loading") {
    button = <LoadingButton
      fontSize={fontSize}
      width={width}
      height={height}
      maxWidth={maxWidth}
      marginTop={marginTop}
      testId={btnTestId}
      ref={ref}
    />
  } else if (buttonState.state === "animated") {
    button = <AnimatedButton
      animation={buttonState.animation}
      text={buttonState.text}
      fontSize={fontSize}
      width={width}
      height={height}
      maxWidth={maxWidth}
      marginTop={marginTop}
      ref={ref}
    />
  }

  return (
    button
  )
})

export default Button