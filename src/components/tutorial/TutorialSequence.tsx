import { useCallback, useEffect, useState } from "react"
import TutorialPopup, { TutorialPopupInfo } from "./TutorialPopup"

interface TutorialSequenceProps {
  popupProps: TutorialPopupInfo[],
  displayTutes: boolean,
  id: string
}

export default function TutorialSequence({ popupProps, displayTutes, id }: TutorialSequenceProps) {
  const [curIdx, setCurIdx] = useState(0)
  const [finishedTute, setFinishedTute] = useState(false)

  const onClose = useCallback(() => {
    if (curIdx < popupProps.length - 1) {
      // We still have popups to show
      setCurIdx(curIdx + 1)
      return
    }

    // We have shown all popups
    setFinishedTute(true)
    // Do not show this tutorial again
    localStorage.setItem(`tutorial_${id}_shown`, "true")
  }, [curIdx, popupProps.length, id])

  // Only display tutorials if they have not been fully shown before
  useEffect(() => {
    if (localStorage.getItem(`tutorial_${id}_shown`)) setFinishedTute(true)
  }, [id])

  if (finishedTute || !displayTutes || popupProps.length <= 0) return null

  return (
    <TutorialPopup info={popupProps[curIdx]} onClose={onClose} />
  )
}