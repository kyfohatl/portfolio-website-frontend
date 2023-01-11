import { useMemo } from "react"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../../FeatureDisplayCard"
import HelpDisplayBackground from "../HelpDisplayBackground"
import HelpDisplayCloseButton from "../HelpDisplayCloseButton"
import styles from "./HelpDisplayMobile.module.css"

interface HelpDisplayMobileProps {
  cardProps: FeatureDisplayCardProps[],
  onClose: () => void
}

export default function HelpDisplayMobile({ cardProps, onClose }: HelpDisplayMobileProps) {
  const cards = useMemo(() => {
    const cardsList = []

    for (const prop of cardProps) {
      cardsList.push(<FeatureDisplayCard {...prop} />)
    }

    return cardsList
  }, [cardProps])

  return (
    <div className={styles.outerContainer}>
      <HelpDisplayBackground onClose={onClose} />

      <div className={styles.displayContainer}>
        <HelpDisplayCloseButton onClose={onClose} />
        <div className={styles.cardContainer}>
          {cards}
        </div>
      </div>
    </div>
  )
}