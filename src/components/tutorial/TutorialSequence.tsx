import { useCallback, useEffect, useState } from "react"
import TutorialPopup, { TutorialPopupInfo } from "./TutorialPopup"

interface TutorialSequenceProps {
  popupProps: TutorialPopupInfo[],
  shouldDisplay: boolean,
  setShouldDisplay: (newVal: boolean) => void,
  id: string,
  displayOnce?: boolean
}

export default function TutorialSequence({
  popupProps,
  shouldDisplay,
  setShouldDisplay,
  id,
  displayOnce = true
}: TutorialSequenceProps) {
  const [curIdx, setCurIdx] = useState(0)
  const [displayedAtLeastOnce, setDisplayedAtLeastOnce] = useState(false)

  const onClose = useCallback(() => {
    if (curIdx < popupProps.length - 1) {
      // We still have popups to show
      setCurIdx(curIdx + 1)
      return
    }

    // We have shown all popups
    // Do not show this tutorial again if displayOnce is true
    if (displayOnce) {
      localStorage.setItem(`tutorial_${id}_shown`, "true")
      setDisplayedAtLeastOnce(true)
    }

    // Reset the index in case the tutorial is shown again
    setCurIdx(0)
    // Finish tutorial
    setShouldDisplay(false)
  }, [curIdx, popupProps.length, setShouldDisplay, id, displayOnce])

  // If set to displayOnce, only display tutorials if they have not been fully shown before
  useEffect(() => {
    if (!displayOnce) return
    if (localStorage.getItem(`tutorial_${id}_shown`)) setDisplayedAtLeastOnce(true)
  }, [id, displayOnce])

  // If the tutorial is only to be shown once, and has already been fully shown, do not show again
  if (displayOnce && displayedAtLeastOnce) return null

  if (!shouldDisplay || popupProps.length <= 0) return null

  return (
    <TutorialPopup info={popupProps[curIdx]} onClose={onClose} />
  )
}