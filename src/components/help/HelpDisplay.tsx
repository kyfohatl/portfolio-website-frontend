import React, { useCallback, useMemo, useState } from "react"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard"
import AnimatedCard from "./AnimatedCard"
import AnimatedDial from "./AnimatedDial"
import styles from "./HelpDisplay.module.css"
import DialContainer from "./DialContainer"
import HelpDisplayPlaceholderButton from "./HelpDisplayPlaceholderButton"
import HelpDisplaySideButton, { Direction } from "./HelpDisplaySideButton"
import HelpDisplayCloseButton from "./HelpDisplayCloseButton"
import useKeyPress, { useKeyPressProps } from "../../hooks/useKeyPress"

interface HelpDisplayProps {
  cardProps: FeatureDisplayCardProps[],
  onClose: () => void,
  initIdx?: number
}

interface AnimationRunningState {
  running: true,
  direction: Direction,
  nextCardInx: number
}

export type AnimationState = { running: false } | AnimationRunningState

const ANIMATION_DURATION = "0.3s"

export const OUTER_CONTAINER_GAP = "26px"

export default function HelpDisplay({ cardProps, onClose, initIdx = 0 }: HelpDisplayProps) {
  const [cardIndex, setCardIndex] = useState(initIdx)
  const [animState, setAnimState] = useState<AnimationState>({ running: false })

  const onAnimationEnd = useCallback(() => {
    if (!animState.running) {
      throw new Error("Help display onAnimationEnd ran whilst animation state is set to not running")
    }

    setCardIndex(animState.nextCardInx)
    setAnimState({ running: false })
  }, [animState])

  const onClick = useCallback((nextIndex: number) => {
    // Ensure given index is in bounds
    if (nextIndex < 0 || nextIndex >= cardProps.length) {
      throw new Error(`Help display index of ${nextIndex} is out of bounds!`)
    }

    // If the nextIndex is the same as cardIndex, then we do not need to do anything
    if (nextIndex === cardIndex) return

    if (nextIndex > cardIndex) {
      // Movement to the right
      setAnimState({ running: true, direction: "right", nextCardInx: nextIndex })
    } else {
      // Movement to the left
      setAnimState({ running: true, direction: "left", nextCardInx: nextIndex })
    }
  }, [cardProps.length, cardIndex])

  const onButtonClick = useCallback((direction: Direction) => {
    if (direction === "left") {
      // Left button was clicked
      if (cardIndex > 0) onClick(cardIndex - 1)
    } else {
      // Right button was clicked
      if (cardIndex < cardProps.length - 1) onClick(cardIndex + 1)
    }
  }, [cardIndex, cardProps.length, onClick])

  // Setup keyboard controls
  const keyBindings: useKeyPressProps = useMemo(() => [
    { key: "ArrowLeft", callBack: () => onButtonClick("left") },
    { key: "ArrowRight", callBack: () => onButtonClick("right") },
    { key: "Escape", callBack: onClose }
  ], [onButtonClick, onClose])
  useKeyPress(keyBindings)

  const curCard = cardProps[cardIndex]

  return (
    <>
      <div data-testid="helpDisplayBackground" className={styles.background} onClick={onClose}></div>

      <div
        className={styles.outerContainer}
        style={{ gap: OUTER_CONTAINER_GAP }}
        data-testid="helpDisplayOuterContainer"
      >
        <div
          className={styles.closeButtonContainer}
          style={{ "--cardWidth": curCard.dimensions?.width } as React.CSSProperties}
        >
          <HelpDisplayCloseButton onClose={onClose} />
        </div>

        <div className={styles.displayContainer}>
          {/* Only show the left button if there are more cards to show in that direction */}
          {cardIndex > 0
            ? <HelpDisplaySideButton direction="left" callBack={onButtonClick} disabled={animState.running} />
            : <HelpDisplayPlaceholderButton />
          }

          {/* If animation is running, do not show the current card */}
          {animState.running
            ?
            // Display a placeholder of the same size as a card, to prevent collapse of the display container
            // when animation is running
            <div style={{ ...curCard.dimensions }}></div>
            :
            // If animation is not running, display the current card
            <div>
              <FeatureDisplayCard
                {...curCard}
                boxShadow="0px 0px 8px 10px #C1C1C1"
              />
            </div>
          }

          {/* Only show the right button if there are more cards to show in that direction */}
          {cardIndex < cardProps.length - 1
            ? <HelpDisplaySideButton direction="right" callBack={onButtonClick} disabled={animState.running} />
            : <HelpDisplayPlaceholderButton />
          }

        </div>

        <DialContainer curIndex={cardIndex} numDials={cardProps.length} animState={animState} onClick={onClick} />
      </div>
      {/* While animation is running, show the current card leaving, and the next card incoming */}
      {animState.running
        ?
        <>
          <AnimatedCard
            cardProps={cardProps[animState.nextCardInx]}
            direction={animState.direction}
            type={"incoming"}
            duration={ANIMATION_DURATION}
            onAnimationEnd={onAnimationEnd}
          />
          <AnimatedCard
            cardProps={curCard}
            direction={animState.direction}
            type={"outgoing"}
            duration={ANIMATION_DURATION}
          />
          <AnimatedDial
            curIndex={cardIndex}
            nextIndex={animState.nextCardInx}
            numDials={cardProps.length}
            duration={ANIMATION_DURATION}
            helpDisplayCardHeight={curCard.dimensions?.height || "100px"}
            helpDisplayOuterContainerGap={OUTER_CONTAINER_GAP}
          />
        </>
        : null
      }
    </>
  )
}