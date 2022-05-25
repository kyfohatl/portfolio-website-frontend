import { CSSProperties } from "react"
import styles from "./SavingButton.module.css"

interface SavingButtonProps {
  fontSize?: string,
  width?: string,
  height?: string,
  marginTop?: string,
  onAnimationEnd: () => void
}

export default function SavingButton({
  fontSize = "14px",
  width = "100px",
  height = "100px",
  marginTop = "10px",
  onAnimationEnd
}: SavingButtonProps) {
  const buttonStyles: CSSProperties = {
    fontSize: fontSize,
    width: width,
    height: height,
    marginTop: marginTop
  }

  return (
    <button disabled className={styles.button} style={buttonStyles}>
      <svg className={styles.checkbox} viewBox="0 0 100 100" fill="none">
        <path
          onAnimationEnd={onAnimationEnd}
          className={styles.check}
          d="M20 62.0377L37.7391 80L76 24"
          stroke="#43a047"
          strokeWidth="4"
        />
        <circle className={styles.circle} cx="50" cy="50" r="48" stroke="#43a047" strokeWidth="4" />
      </svg>
      <div className={styles.text}>Saved</div>
    </button>
  )
}