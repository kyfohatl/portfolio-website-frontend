import styles from "./Button.module.css"

import React from "react"
import LoadingButton from "./LoadingButton"

// A callback button must come with a callback function
interface CallBackButton {
  type: "button",
  callBack: () => void
}

// A submit type button does not need a callback function
interface SubmitButton {
  type: "submit"
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
  isLoading?: boolean
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
  isLoading = false
}: ButtonProps) {
  let button = <button
    className={styles.button}
    type={type.type}
    style={{
      backgroundColor: backgroundColor,
      fontSize: fontSize,
      color: color,
      width: width,
      height: height,
      marginTop: marginTop
    }}
    {...(type.type === "button" ? { onClick: type.callBack } : {})}
  >
    {icon}
    {text}
  </button>

  if (isLoading) button = <LoadingButton
    fontSize={fontSize}
    width={width}
    height={height}
    marginTop={marginTop}
  />

  return (
    button
  )
}