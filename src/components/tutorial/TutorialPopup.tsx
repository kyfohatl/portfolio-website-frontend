import { useEffect, useMemo, useState } from "react"
import useKeyPress, { useKeyPressProps } from "../../hooks/useKeyPress"
import throttle from "../../lib/helpers/throttle"
import TutorialArrow from "./TutorialArrow"
import TutorialCard from "./TutorialCard"

import styles from "./TutorialPopup.module.css"

export type DeviceType = "mobile" | "desktop" | "all"

export interface TutorialPopupInfo {
  target: React.RefObject<HTMLElement>,
  xOffset: number,
  yOffset: number,
  title: string,
  notes: string,
  image: string,
  imgAlt: string,
  imgWidth: string,
  imgHeight: string,
  cardTestId?: string
}

interface TutorialPopupProps {
  info: TutorialPopupInfo,
  onClose: () => void,
  deviceType?: DeviceType
}

// Calculates the rotation angle to correctly rotate the svg arrow (which is by default pointing downwards)
function getArrowAngle(xOffset: number, yOffset: number) {
  // The arrow should always point AWAY from the popup. Hence the x and y values for the arrow are flipped when 
  // calculating direction
  const x = -xOffset
  const y = -yOffset

  const rotationRad = Math.abs(Math.atan(y / x))
  const rotationDeg = rotationRad * (180 / Math.PI)

  // Now based on the quadrant the arrow is in, the angle needs to be adjusted to correctly face the right direction
  if (x >= 0 && y >= 0) return 270 + rotationDeg
  if (x < 0 && y > 0) return 90 - rotationDeg
  if (x <= 0 && y < 0) return 90 + rotationDeg
  return 270 - rotationDeg
}

export default function TutorialPopup({
  info,
  onClose,
  deviceType = "all"
}: TutorialPopupProps) {
  const [targetPos, setTargetPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [cardStats, setCardStats] = useState<{ right: number, top: number }>({ right: 0, top: 0 })
  const [arrowStats, setArrowStats] = useState<{
    left: number,
    top: number,
    rotation: number,
    width: number,
    height: number
  }>({ left: 0, top: 0, rotation: 0, width: 0, height: 0 })

  // Add keyboard controls
  const keyBindings: useKeyPressProps = useMemo(() => [
    { key: "Escape", callBack: onClose }
  ], [onClose])
  useKeyPress(keyBindings)

  // Updates the position of the target
  const updateTargetPos = useMemo(() => throttle(() => {
    if (!info.target.current) return

    const rect = info.target.current.getBoundingClientRect()
    // The target position is the bottom left corner of the target div
    setTargetPos({ x: rect.left, y: rect.top + rect.height })
  }, 20), [info.target])

  // Ensure popup position is changed when the window is resized
  useEffect(() => {
    window.addEventListener("resize", updateTargetPos)
    return () => window.removeEventListener("resize", updateTargetPos)
  }, [updateTargetPos])

  // Calculate card position, arrow position, dimensions and rotation
  useEffect(() => {
    // Find out the position of the card
    const cardRight = (window.innerWidth - targetPos.x) - info.xOffset
    const cardTop = targetPos.y + info.yOffset

    setCardStats({ right: cardRight, top: cardTop })

    // Find out the position of the arrow

    // Get the dimensions of the arrow
    // The height of the arrow is 65% of the distance between card top-right and target bottom-left
    const arrowHeight = 0.65 * Math.sqrt(info.xOffset * info.xOffset + info.yOffset * info.yOffset)
    // The width of the arrow is 1/3 of its height
    const arrowWidth = arrowHeight / 3

    // Then find the centre of the arrow, which is at the halfway point between the card top-right and target bottom-right
    const arrowCentreX = targetPos.x + (info.xOffset / 2)
    const arrowCentreY = targetPos.y + (info.yOffset / 2)

    // Using the centre find the top and left positions of the arrow
    // By default, the arrow svg is point downwards, so the top and left will be calculated according to this
    const arrowLeft = arrowCentreX - (arrowWidth / 2)
    const arrowTop = arrowCentreY - (arrowHeight / 2)

    // Finally find the arrow rotation, then convert to degrees and account for the arrow initially pointing downwards
    const arrowRotation = getArrowAngle(info.xOffset, info.yOffset)

    setArrowStats({ left: arrowLeft, top: arrowTop, rotation: arrowRotation, width: arrowWidth, height: arrowHeight })
  }, [targetPos, info.xOffset, info.yOffset])

  useEffect(updateTargetPos, [updateTargetPos])

  // Place a "target" visual on the target
  useEffect(() => {
    if (!info.target.current) return

    info.target.current.classList.add(styles.target)

    // Remove the visual upon unmounting
    return () => {
      if (info.target.current) {
        info.target.current.classList.remove(styles.target)
      }
    }
  }, [info.target])

  return (
    <div
      {...(deviceType === "desktop"
        ? { className: styles.desktop }
        : deviceType === "mobile"
          ? { className: styles.mobile }
          : {}
      )}
    >
      <TutorialCard
        title={info.title}
        notes={info.notes}
        image={info.image}
        imgAlt={info.imgAlt}
        imgWidth={info.imgWidth}
        imgHeight={info.imgHeight}
        pos={{ right: cardStats.right + "px", top: cardStats.top + "px" }}
        onClose={onClose}
        testId={info.cardTestId}
      />
      {deviceType !== "mobile"
        ? <TutorialArrow
          left={arrowStats.left + "px"}
          top={arrowStats.top + "px"}
          rotation={arrowStats.rotation}
          width={arrowStats.width + "px"}
          height={arrowStats.height + "px"}
          movementLength={20}
        />
        : null
      }
    </div>
  )
}