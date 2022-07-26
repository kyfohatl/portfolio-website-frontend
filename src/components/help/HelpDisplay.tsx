import { useCallback, useState } from "react"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard"
import AnimatedCard from "./AnimatedCard"
import AnimatedDial from "./AnimatedDial"
import styles from "./HelpDisplay.module.css"
import HelpDisplayDial from "./HelpDisplayDial"
import HelpDisplayPlaceholderButton from "./HelpDisplayPlaceholderButton"
import HelpDisplaySideButton, { Direction } from "./HelpDisplaySideButton"

interface HelpDisplayProps {
  cardProps: FeatureDisplayCardProps[]
}

interface AnimationRunningState {
  running: true,
  direction: Direction,
  nextCardInx: number
}

type AnimationState = { running: false } | AnimationRunningState

const ANIMATION_DURATION = "0.3s"

export const OUTER_CONTAINER_GAP = "26px"

function getNextCardIndex(curIndex: number, direction: Direction) {
  if (direction === "left") return curIndex - 1
  return curIndex + 1
}

export default function HelpDisplay({ cardProps }: HelpDisplayProps) {
  const [cardIndex, setCardIndex] = useState(0)
  const [animState, setAnimState] = useState<AnimationState>({ running: false })
  // const [displayCardContainerClasses, setDisplayCardContainerClasses] = useState<string[]>([])

  const onAnimationEnd = useCallback((direction: Direction) => {
    setAnimState({ running: false })
    setCardIndex(getNextCardIndex(cardIndex, direction))
  }, [cardIndex])

  const onLeftClick = useCallback(() => {
    if (cardIndex > 0) {
      setAnimState({ running: true, direction: "left", nextCardInx: getNextCardIndex(cardIndex, "left") })
    }
  }, [cardIndex])

  const onRightClick = useCallback(() => {
    if (cardIndex < cardProps.length - 1) {
      setAnimState({ running: true, direction: "right", nextCardInx: getNextCardIndex(cardIndex, "right") })
    }
  }, [cardIndex, cardProps.length])

  const curCard = cardProps[cardIndex]

  return (
    <>
      <div className={styles.background}></div>

      <div className={styles.outerContainer} style={{ gap: OUTER_CONTAINER_GAP }}>
        <div className={styles.displayContainer}>
          {/* Only show the left button if there are more cards to show in that direction */}
          {cardIndex > 0
            ? <HelpDisplaySideButton direction="left" callBack={onLeftClick} disabled={animState.running} />
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
                title={curCard.title}
                notes={curCard.notes}
                visuals={curCard.visuals}
                theme={curCard.theme}
                dimensions={curCard.dimensions}
                borderRadius={curCard.borderRadius}
              />
            </div>
          }

          {/* Only show the right button if there are more cards to show in that direction */}
          {cardIndex < cardProps.length - 1
            ? <HelpDisplaySideButton direction="right" callBack={onRightClick} disabled={animState.running} />
            : <HelpDisplayPlaceholderButton />
          }

        </div>

        <HelpDisplayDial index={cardIndex} size={cardProps.length} showActiveDial={!animState.running} />
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