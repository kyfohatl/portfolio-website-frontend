import { CSSProperties, useCallback, useMemo, useState } from "react"
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

export default function HelpDisplayMobile({ cardProps, onClose }: HelpDisplayMobileProps) {
  const [lefts, setLefts] = useState<number[]>(cardProps.map(() => 0))

  const cards = useMemo(() => {
    // The distance required for a card to go from the center of the screen to completely off the screen
    const offScrnDist = (window.innerWidth + parseInt(cardProps[0].dimensions.mobile.w)) / 2

    const cardsList = cardProps.map((prop, i) => {
      // Calculate the current scale of the card, based on how far away it is from the center of the screen
      // Cap the value to a minimum scale value
      const curScale = Math.max((-SCALING_GRADIENT * Math.abs(lefts[i]) / offScrnDist) + 1, MIN_CARD_SCALE)

      return (
        <div className={styles.cardWrapper} style={{ "--curScale": curScale } as CSSProperties}>
          <FeatureDisplayCard {...prop} boxShadow="0px 0px 6px 6px #C1C1C1" />
        </div>
      )
    })

    return cardsList
  }, [cardProps, lefts])

  const onScroll = useCallback((container: HTMLDivElement) => {
    const screenCenterX = window.innerWidth / 2
    const children = container.children
    const newLefts: number[] = []

    for (const child of children) {
      const rect = child.getBoundingClientRect()
      const elemCenterX = rect.left + rect.width / 2
      newLefts.push(elemCenterX - screenCenterX)
    }

    setLefts(newLefts)
  }, [])

  return (
    <div className={styles.outerContainer}>
      <HelpDisplayBackground onClose={onClose} />

      <div className={styles.displayContainer}>
        <div className={styles.buttonContainer}>
          <HelpDisplayCloseButton onClose={onClose} />
        </div>
        <div
          className={styles.cardContainer}
          onScroll={(e) => onScroll(e.currentTarget)}
        >
          {cards}
        </div>
      </div>
    </div>
  )
}