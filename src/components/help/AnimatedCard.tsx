import styles from "./AnimatedCard.module.css"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard";
import { Direction } from "./HelpDisplaySideButton";
import { DIAL_SIZE } from "./DialContainer";
import React from "react";
import { CLOSE_BUTTON_SIZE } from "./HelpDisplayCloseButton";

type AnimatedCardType = "incoming" | "outgoing"

interface AnimatedCardProps {
  cardProps: FeatureDisplayCardProps,
  direction: Direction,
  type: AnimatedCardType,
  duration: string,
  onAnimationEnd?: () => void
}

function getCardClasses(type: AnimatedCardType, direction: Direction) {
  if (type === "incoming") {
    if (direction === "left") {
      // Incoming card coming from the left side
      return `${styles.base} ${styles.incomingCardL} ${styles.incomingSlideR}`
    }
    // Incoming card coming from the right side
    return `${styles.base} ${styles.incomingCardR} ${styles.incomingSlideL}`
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
  /* We want to have an incoming card slide in and replace the outgoing card. Both the incoming card and the place 
  it aims for (destination) are at the center of the screen. However, the destination is slightly off center because 
  the place where the card goes is part of a larger div which contains arrow buttons and dials. This larger div is 
  centered at the middle of the screen, but the card within it is not. So we need to figure out the offset of the 
  center of the card slot from the center of the screen, so that our incoming card is not actually at the center of 
  the screen, but instead at a center +/- offset position. To find the offset, we use the formula below. */
  const displayContainerVerticalOffset = `${(parseInt(CLOSE_BUTTON_SIZE) - parseInt(DIAL_SIZE)) / 2}px`

  return (
    <div
      data-testid="animatedCardContainer"
      className={getCardClasses(type, direction)}
      {...(onAnimationEnd ? { onAnimationEnd: onAnimationEnd } : {})}
      style={{
        "--displayContainerVerticalOffset": displayContainerVerticalOffset,
        "--animationDuration": duration
      } as React.CSSProperties}
    >
      <FeatureDisplayCard {...cardProps} />
    </div>
  )
}