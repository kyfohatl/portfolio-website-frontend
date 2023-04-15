import React from "react"
import styles from "./LoadingButton.module.css"

interface LoadingButtonProps {
  fontSize?: string,
  width?: string,
  height?: string,
  maxWidth?: string,
  marginTop?: string,
  testId?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(({
  fontSize = "14px",
  width = "150px",
  height = "100px",
  maxWidth,
  marginTop = "10px",
  testId
}, ref) => {
  // Scale the indicator size with the size of the button, but make sure it does not overflow
  // First find the smaller dimension
  let smallerDimension = height
  if (parseInt(width) < parseInt(height)) smallerDimension = width

  // Then use that dimension to determine the size of the indicator
  let indicatorSize: string = parseInt(smallerDimension) * 0.4 + ""
  if (smallerDimension.at(smallerDimension.length - 1) === "%") {
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
        maxWidth: maxWidth,
        marginTop: marginTop,
        "--indicatorSize": indicatorSize
      } as React.CSSProperties}
      data-testid={`${testId}Loading`}
      ref={ref}
    >
      Loading
    </button>
  )
})

export default LoadingButton