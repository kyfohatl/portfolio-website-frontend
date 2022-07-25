import styles from "./AnimatedCard.module.css"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard";
import { Direction } from "./HelpDisplaySideButton";
import { OUTER_CONTAINER_GAP } from "./HelpDisplay";
import { DIAL_SIZE } from "./HelpDisplayDial";
import React from "react";

interface AnimatedCardProps {
  cardProps: FeatureDisplayCardProps,
  direction: Direction,
  duration: string,
  onAnimationEnd: (direction: Direction) => void
}

function getIncomingCardClasses(direction: Direction) {
  if (direction === "left") {
    return `${styles.inComingCard} ${styles.inComingCardL} ${styles.slideR}`
  }
  return `${styles.inComingCard} ${styles.inComingCardR} ${styles.slideL}`
}

export default function AnimatedCard({ cardProps, direction, duration, onAnimationEnd }: AnimatedCardProps) {
  return (
    <div
      className={getIncomingCardClasses(direction)}
      onAnimationEnd={() => onAnimationEnd(direction)}
      style={{
        "--outerContainerGap": OUTER_CONTAINER_GAP,
        "--dialSize": DIAL_SIZE,
        "--animationDuration": duration
      } as React.CSSProperties}
    >
      <FeatureDisplayCard
        title={cardProps.title}
        notes={cardProps.notes}
        visuals={cardProps.visuals}
        theme={cardProps.theme}
        dimensions={cardProps.dimensions}
        borderRadius={cardProps.borderRadius}
      />
    </div>
  )
}