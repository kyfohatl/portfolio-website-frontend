import { CSSProperties } from "react";
import AnimationProps from "./AnimationProps";
import styles from "./Saving.module.css"

export type SavingStyleOverrides = { tickStyles: CSSProperties, circleStyles: CSSProperties }

interface SavingProps extends AnimationProps {
  overrides?: SavingStyleOverrides
}

export default function Saving({ onAnimationEnd, overrides }: SavingProps) {
  return (
    <svg data-testid="savingAnimation" className={styles.checkbox} viewBox="0 0 100 100" fill="none">
      <path
        data-testid="savingCheckmark"
        onAnimationEnd={onAnimationEnd}
        style={overrides?.tickStyles}
        className={styles.check}
        d="M20 62.0377L37.7391 80L76 24"
        stroke="#43a047"
        strokeWidth="4"
      />
      <circle
        style={overrides?.circleStyles}
        className={styles.circle}
        cx="50"
        cy="50"
        r="48"
        stroke="#43a047"
        strokeWidth="4"
      />
    </svg>
  )
}