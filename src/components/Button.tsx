import styles from "./Button.module.css"

import React from "react"

interface ButtonProps {
  text: string,
  callBack: () => void,
  backgroundColor?: string,
  fontSize?: string,
  color?: string,
  width?: string,
  height?: string,
  marginTop?: string,
  icon?: React.ReactNode
}

export default function Button({
  text,
  callBack,
  backgroundColor = "#8B0000",
  fontSize = "14px",
  color = "#FFFFFF",
  width = "100px",
  height = "100px",
  marginTop = "10px",
  icon
}: ButtonProps) {
  return (
    <button
      className={styles.button}
      type="button"
      style={{
        backgroundColor: backgroundColor,
        fontSize: fontSize,
        color: color,
        width: width,
        height: height,
        marginTop: marginTop
      }}
      onClick={callBack}
    >
      {icon}
      {text}
    </button>
  )
}