import { CSSProperties, useCallback, useMemo, useState } from "react"
import FeatureDisplayCard, { FeatureDisplayCardProps } from "../../FeatureDisplayCard"
import HelpDisplayBackground from "../HelpDisplayBackground"
import HelpDisplayCloseButton from "../HelpDisplayCloseButton"
import styles from "./HelpDisplayMobile.module.css"

interface HelpDisplayMobileProps {
  cardProps: FeatureDisplayCardProps[],
  onClose: () => void
}

export default function HelpDisplayMobile({ cardProps, onClose }: HelpDisplayMobileProps) {
  const [lefts, setLefts] = useState<number[]>(cardProps.map(() => 0))

  const cards = useMemo(() => {
    const cardsList = cardProps.map((prop, i) => {
      return (
        <div className={styles.cardWrapper} style={{ "--distToCenterX": lefts[i] } as CSSProperties}>
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