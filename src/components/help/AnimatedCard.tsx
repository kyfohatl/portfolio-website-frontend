import styles from "./AnimatedCard.module.css"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard";
import { Direction } from "./HelpDisplaySideButton";
import { OUTER_CONTAINER_GAP } from "./HelpDisplay";
import { DIAL_SIZE } from "./HelpDisplayDial";
import React from "react";

type AnimatedCardType = "incoming" | "outgoing"

interface AnimatedCardProps {
  cardProps: FeatureDisplayCardProps,
  direction: Direction,
  type: AnimatedCardType,
  duration: string,
  onAnimationEnd?: (direction: Direction) => void
}

function getCardClasses(type: AnimatedCardType, direction: Direction) {
  if (type === "incoming") {
    if (direction === "left") {
      // Incoming card coming from the left side
      return `${styles.base} ${styles.inComingCardL} ${styles.incomingSlideR}`
    }
    // Incoming card coming from the right side
    return `${styles.base} ${styles.inComingCardR} ${styles.incomingSlideL}`
  }

  // Note that outgoing cards travel in the opposite direction to incoming cards
  // So if an incoming card is coming from the left direction, then the outgoing card
  // must go right
  if (direction === "left") {
    // Outgoing card going to the right side
    return `${styles.base} ${styles.outgoingCard} ${styles.outgoingSlideR}`
  }
  // Outgoing card going to the left side
  return `${styles.base} ${styles.outgoingCard} ${styles.outgoingSlideL}`
}

export default function AnimatedCard({ cardProps, direction, type, duration, onAnimationEnd }: AnimatedCardProps) {
  return (
    <div
      className={getCardClasses(type, direction)}
      {...(onAnimationEnd ? { onAnimationEnd: () => onAnimationEnd(direction) } : {})}
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