import { useCallback, useState } from "react"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../FeatureDisplayCard"
import styles from "./HelpDisplay.module.css"
import HelpDisplayDial, { DIAL_SIZE } from "./HelpDisplayDial"
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

const ANIMATION_DURATION = "5s"

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
    <div>
      <div className={styles.background}></div>
      {animState.running
        ?
        : null
      }
      <div className={styles.outerContainer} style={{ gap: OUTER_CONTAINER_GAP }}>
        <div className={styles.displayContainer}>
          <HelpDisplaySideButton direction="left" callBack={onLeftClick} />
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
          <HelpDisplaySideButton direction="right" callBack={onRightClick} />
        </div>
        <HelpDisplayDial index={cardIndex} size={cardProps.length} />
      </div>
    </div>
  )
}