import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { WithRequiredType } from "../../../lib/typeHelpers/withRequiredType"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../../FeatureDisplayCard"
import HelpDisplayBackground from "../HelpDisplayBackground"
import HelpDisplayCloseButton from "../HelpDisplayCloseButton"
import styles from "./HelpDisplayMobile.module.css"

// The smallest scale a card gets in the carousel
const MIN_CARD_SCALE = 0.75
// We use the smallest scale value to get the scaling gradient
const SCALING_GRADIENT = 1 - MIN_CARD_SCALE

interface HelpDisplayMobileProps {
  cardProps: WithRequiredType<FeatureDisplayCardProps, "dimensions">[],
  onClose: () => void
}

// Calculates and sets all the X distances from the center of the screen of each child element of the given parent
// using the given setter 
function calculateDistances(parent: HTMLDivElement, setter: (newDistances: number[]) => void) {
  const screenCenterX = window.innerWidth / 2
  const children = parent.children
  const newDists: number[] = []

  for (const child of children) {
    const rect = child.getBoundingClientRect()
    const elemCenterX = rect.left + rect.width / 2
    newDists.push(elemCenterX - screenCenterX)
  }

  setter(newDists)
}

export default function HelpDisplayMobile({ cardProps, onClose }: HelpDisplayMobileProps) {
  const [distToCenterXs, setDistToCenterXs] = useState<number[]>(cardProps.map(() => 0))

  // Make sure that the first time the dialogue is opened, it renders the cards at the correct scale
  const cardContainerRef = useRef(null)
  useEffect(() => {
    if (!cardContainerRef.current) return
    calculateDistances(cardContainerRef.current, setDistToCenterXs)
  }, [])

  const cards = useMemo(() => {
    // The distance required for a card to go from the center of the screen to completely off the screen
    const offScrnDist = (window.innerWidth + parseInt(cardProps[0].dimensions.mobile.w)) / 2

    const cardsList = cardProps.map((prop, i) => {
      // Calculate the current scale of the card, based on how far away it is from the center of the screen
      // Cap the value to a minimum scale value
      const curScale = Math.max((-SCALING_GRADIENT * Math.abs(distToCenterXs[i]) / offScrnDist) + 1, MIN_CARD_SCALE)

      return (
        <div className={styles.cardWrapper} style={{ "--curScale": curScale } as CSSProperties}>
          <FeatureDisplayCard {...prop} boxShadow="0px 0px 6px 6px #C1C1C1" />
        </div>
      )
    })

    return cardsList
  }, [cardProps, distToCenterXs])

  return (
    <div className={styles.outerContainer}>
      <HelpDisplayBackground onClose={onClose} />

      <div className={styles.displayContainer}>
        <div className={styles.buttonContainer}>
          <HelpDisplayCloseButton onClose={onClose} />
        </div>
        <div
          className={styles.cardContainer}
          onScroll={(e) => calculateDistances(e.currentTarget, setDistToCenterXs)}
          ref={cardContainerRef}
        >
          {cards}
        </div>
      </div>
    </div>
  )
}