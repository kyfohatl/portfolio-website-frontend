import { useEffect, useMemo, useState } from "react"
import throttle from "../../lib/helpers/throttle"
import TutorialArrow from "./TutorialArrow"
import TutorialCard from "./TutorialCard"

interface TutorialPopupProps {
  target: HTMLDivElement | null,
  xOffset: number,
  yOffset: number,
  shouldDisplay: boolean,
  title: string,
  notes: string,
  image: string,
  imgAlt: string,
  onClose: () => void
}

export default function TutorialPopup({
  target,
  xOffset,
  yOffset,
  shouldDisplay,
  title,
  notes,
  image,
  imgAlt,
  onClose
}: TutorialPopupProps) {
  const [targetPos, setTargetPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  // Updates the position of the target
  const updateTargetPos = useMemo(() => throttle(() => {
    if (!target) return

    const rect = target.getBoundingClientRect()
    // The target position is the bottom left corner of the target div
    setTargetPos({ x: rect.left, y: rect.top + rect.height })
  }, 20), [target])

  // Ensure popup position is changed when the window is resized
  useEffect(() => {
    window.addEventListener("resize", updateTargetPos)
    return () => window.removeEventListener("resize", updateTargetPos)
  }, [target, updateTargetPos])

  // Find out the position of the card
  const cardRight = (window.innerWidth - targetPos.x) + xOffset
  const cardTop = targetPos.y + yOffset

  // Find out the position of the arrow

  // First get the top right position of the card
  const cardTopRightX = targetPos.x - xOffset
  const cardTopRightY = targetPos.y + yOffset

  // Now get the dimensions of the arrow
  // The height of the arrow is 65% of the distance between card top-right and target bottom-left
  const arrowHeight = 0.65 * Math.sqrt(xOffset * xOffset + yOffset * yOffset)
  // The width of the arrow is 1/3 of its height
  const arrowWidth = arrowHeight / 3

  // Then find the centre of the arrow, which is at the halfway point between the card top-right and target bottom-right
  const arrowCentreX = targetPos.x - (xOffset / 2)
  const arrowCentreY = targetPos.y + (yOffset / 2)

  // Using the centre find the top and left positions of the arrow
  // By default, the arrow svg is point downwards, so the top and left will be calculated according to this
  const arrowLeft = arrowCentreX - (arrowWidth / 2)
  const arrowTop = arrowCentreY - (arrowHeight / 2)

  // Finally find the arrow rotation, then convert to degrees and account for the arrow initially pointing downwards
  const rotationRad = Math.atan((targetPos.y - cardTopRightY) / (targetPos.x - cardTopRightX))
  const rotationDeg = rotationRad * (180 / Math.PI)
  const arrowRotation = rotationDeg - 90

  useEffect(updateTargetPos, [target, updateTargetPos])

  if (!shouldDisplay) return null

  return (
    <>
      <TutorialCard
        title={title}
        notes={notes}
        image={image}
        imgAlt={imgAlt}
        pos={{ right: cardRight + "px", top: cardTop + "px" }}
        onClose={onClose}
      />
      <TutorialArrow
        left={arrowLeft + "px"}
        top={arrowTop + "px"}
        rotation={arrowRotation}
        width={arrowWidth + "px"}
        height={arrowHeight + "px"}
      />
    </>
  )
}