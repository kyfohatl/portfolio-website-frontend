import { CSSProperties, useEffect, useRef, useState } from "react"
import AnimationProps from "./AnimationProps"
import styles from "./QuestionMark.module.css"

export type QuestionMarkStyleOverrides = { circle: CSSProperties, marker: CSSProperties, dot: CSSProperties }

export interface QuestionMarkProps extends AnimationProps {
  height: string,
  width: string,
  overrides?: QuestionMarkStyleOverrides
}

export default function QuestionMark({ height, width, overrides, onAnimationEnd }: QuestionMarkProps) {
  const [markerLength, setMarkerLength] = useState(0)
  const [dotLength, setDotLength] = useState(0)

  const markerRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  // Figure out the lengths of the question mark parts for use by the animations
  useEffect(() => {
    if (markerRef.current) setMarkerLength(markerRef.current.getTotalLength())
    if (dotRef.current) setDotLength(dotRef.current.getTotalLength())
  }, [])

  return (
    <svg
      className={styles.container}
      style={{ "--markerLength": markerLength, "--dotLength": dotLength } as CSSProperties}
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
    >
      <g>
        <circle
          className={styles.circle}
          style={overrides?.circle}
          onAnimationEnd={onAnimationEnd}
          cx="50"
          cy="50"
          r="50"
          fill="black"
        />
        <path
          className={styles.marker}
          ref={markerRef}
          style={overrides?.marker}
          d="M33 33.3333C33 29.9051 34.0264 26.5539 35.9493 23.7035C37.8722 20.853 40.6053 18.6313 43.803 17.3194C47.0007 16.0075 50.5194 15.6643 53.9141 16.3331C57.3087 17.0019 60.4269 18.6527 62.8744 21.0768C65.3218 23.5009 66.9885 26.5894 67.6637 29.9518C68.339 33.3141 67.9924 36.7993 66.6679 39.9665C65.3433 43.1338 63.1003 45.8409 60.2225 47.7455C57.3446 49.6501 53.9612 50.6667 50.5 50.6667L50.5 68"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          className={styles.dot}
          ref={dotRef}
          style={overrides?.dot}
          cx="50.5"
          cy="78.5"
          r="3"
          stroke="white"
          strokeWidth="3"
        />
      </g>
    </svg>
  )
}