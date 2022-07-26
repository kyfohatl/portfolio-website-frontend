import React from "react";
import styles from "./AnimatedDial.module.css"
import { ACTIVE_DIAL_COLOR, DIAL_GAP, DIAL_SIZE } from "./HelpDisplayDial";

interface AnimatedDialProps {
  curIndex: number,
  nextIndex: number,
  numDials: number,
  duration: string,
  helpDisplayCardHeight: string,
  helpDisplayOuterContainerGap: string
}

export default function AnimatedDial({
  curIndex,
  nextIndex,
  numDials,
  duration,
  helpDisplayCardHeight,
  helpDisplayOuterContainerGap
}: AnimatedDialProps) {
  // Convert pixel measurements into numbers
  const dialSizeNum = parseInt(DIAL_SIZE)
  const dialGapNum = parseInt(DIAL_GAP)

  // The vertical offset of the center of the dial from the center of the outer container of the help display
  const verticalOffset = `${(parseInt(helpDisplayCardHeight) + parseInt(helpDisplayOuterContainerGap)) / 2}px`

  const totalDialWidth = numDials * dialSizeNum
  const totalGapWidth = (numDials - 1) * dialGapNum
  const dialContainerWidth = totalDialWidth + totalGapWidth
  // The horizontal offset of the dial from the center of the outer container of the help display, when at the 
  // left side of the dial container
  const baseHorizontalOffset = dialContainerWidth / 2
  // The starting position of the animated dial as an offset from the center of the help display
  const startHorizontalOffset = `${baseHorizontalOffset - curIndex * (dialSizeNum + dialGapNum)}px`
  // The ending position of the animated dial as an offset from the center of the help display
  const endHorizontalOffset = `${baseHorizontalOffset - nextIndex * (dialSizeNum + dialGapNum)}px`

  return (
    <div
      className={styles.dial}
      style={{
        "--dialSize": DIAL_SIZE,
        "--dialGap": DIAL_GAP,
        "--animationDuration": duration,
        "--verticalOffset": verticalOffset,
        "--startHorizontalOffset": startHorizontalOffset,
        "--endHorizontalOffset": endHorizontalOffset,
        backgroundColor: ACTIVE_DIAL_COLOR
      } as React.CSSProperties}
    >
    </div>
  )
}