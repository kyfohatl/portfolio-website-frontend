import React from "react"
import styles from "./LoadingButton.module.css"

interface LoadingButtonProps {
  fontSize?: string,
  width?: string,
  height?: string,
  marginTop?: string
}

export default function LoadingButton({
  fontSize = "14px",
  width = "100px",
  height = "100px",
  marginTop = "10px"
}: LoadingButtonProps) {
  // The height and width of the loading indicator will be half the size of the container
  let indicatorSize: string = parseInt(height) * 0.5 + ""
  if (height.at(height.length - 1) === "%") {
    indicatorSize += "%"
  } else {
    indicatorSize += "px"
  }

  return (
    <button
      disabled
      className={styles.button}
      style={{
        fontSize: fontSize,
        width: width,
        height: height,
        marginTop: marginTop,
        "--indicatorSize": indicatorSize
      } as React.CSSProperties}
    >
      Loading
    </button>
  )
}