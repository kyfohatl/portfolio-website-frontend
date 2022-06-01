import AnimationProps from "./AnimationProps";
import styles from "./Saving.module.css"

export default function Saving({ onAnimationEnd }: AnimationProps) {
  return (
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
  )
}