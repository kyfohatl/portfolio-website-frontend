import React from "react"

interface ButtonProps {
  styles: React.CSSProperties,
  text: string,
  callBack: (...args: any[]) => void,
  callBackArgs: any[]
}

export default function Button({ styles, text, callBack, callBackArgs }: ButtonProps) {
  // Add common css properties
  styles.display = "flex"
  styles.justifyContent = "center"
  styles.alignItems = "center"
  styles.fontFamily = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\""
  styles.borderRadius = "10px"
  styles.borderStyle = "none"

  return (
    <button
      type="button"
      style={styles}
      onClick={() => { callBack(...callBackArgs) }}
    >
      {text}
    </button>
  )
}