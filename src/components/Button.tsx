import styles from "./Button.module.css"

import React from "react"
import LoadingButton from "./LoadingButton"
import SavingButton from "./SavingButton"

export type ButtonState = { state: "normal" } | { state: "loading" } | { state: "saving", onAnimationEnd: () => void }

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

interface ButtonProps {
  text: string,
  type: ButtonType,
  backgroundColor?: string,
  fontSize?: string,
  color?: string,
  width?: string,
  height?: string,
  marginTop?: string,
  icon?: React.ReactNode,
  buttonState?: ButtonState,
  disabled?: boolean
}

export default function Button({
  text,
  type,
  backgroundColor = "#8B0000",
  fontSize = "14px",
  color = "#FFFFFF",
  width = "100px",
  height = "100px",
  marginTop = "10px",
  icon,
  buttonState = { state: "normal" },
  disabled = false
}: ButtonProps) {
  let buttonStyles: React.CSSProperties = {
    fontSize: fontSize,
    width: width,
    height: height,
    marginTop: marginTop
  }

  // Only add color and background color if not disabled as otherwise they override the disabled selector
  // css styling
  if (!disabled) {
    buttonStyles.backgroundColor = backgroundColor
    buttonStyles.color = color
  }

  let button = <button
    className={styles.button}
    type={type.type}
    style={buttonStyles}
    disabled={disabled}
    {...(type.callBack ? { onClick: type.callBack } : {})}
  >
    {icon}
    {text}
  </button>

  if (buttonState.state === "loading") {
    button = <LoadingButton
      fontSize={fontSize}
      width={width}
      height={height}
      marginTop={marginTop}
    />
  } else if (buttonState.state === "saving") {
    button = <SavingButton
      fontSize={fontSize}
      width={width}
      height={height}
      marginTop={marginTop}
      onAnimationEnd={buttonState.onAnimationEnd}
    />
  }

  return (
    button
  )
}