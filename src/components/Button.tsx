import React from "react"

interface ButtonProps {
  styles: React.CSSProperties,
  text: string
}

export default function Button({ styles, text }: ButtonProps) {
  return (
    <button type="button" style={styles}>{text}</button>
  )
}