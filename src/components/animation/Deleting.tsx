import { CSSProperties } from "react"
import AnimationProps from "./AnimationProps"
import styles from "./Deleting.module.css"

export type DeletingStyleOverrides = { rubbishStyles: CSSProperties, lidStyles: CSSProperties }

interface DeletingProps extends AnimationProps {
  overrides?: DeletingStyleOverrides
}

export default function Deleting({ onAnimationEnd, overrides }: DeletingProps) {
  return (
    <svg className={styles.bin} viewBox="0 0 100 100" fill="none">
      {/* Rubbish */}
      <path style={overrides?.rubbishStyles} className={styles.rubbish} d="M49.5 1L59.0459 4.36827L63 12.5L59.0459 20.6317L49.5 24L39.9541 20.6317L36 12.5L39.9541 4.36827L49.5 1Z" fill="darkred" />
      {/* Bin body */}
      <g>
        <rect x="29.5" y="37.5" width="41" height="50" stroke="black" strokeWidth="5" />
        <line x1="43.5" y1="35" x2="43.5" y2="90" stroke="black" strokeWidth="5" />
        <line x1="58.5" y1="35" x2="58.5" y2="90" stroke="black" strokeWidth="5" />
      </g>
      {/* Lid */}
      <g style={overrides?.lidStyles} className={styles.lid} onAnimationEnd={onAnimationEnd}>
        <path d="M17 34C17 31.7909 18.7909 30 21 30H79C81.2091 30 83 31.7909 83 34V34H17V34Z" fill="black" />
        <path d="M45 28C45 26.3431 46.3431 25 48 25H52C53.6569 25 55 26.3431 55 28V30H45V28Z" fill="black" />
      </g>
    </svg>
  )
}