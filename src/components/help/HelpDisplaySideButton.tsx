import Button from "../Button";

import { ReactComponent as ChevronLeft } from "../../assets/images/helpDisplay/chevronLeft.svg"
import { ReactComponent as ChevronRight } from "../../assets/images/helpDisplay/chevronRight.svg"

export type Direction = "left" | "right"

interface HelpDisplaySideButtonProps {
  direction: Direction,
  callBack: (direction: Direction) => void,
  disabled: boolean
}

export const BUTTON_SIZE = "40px"
const CHEVRON_SIZE = "26px"

export default function HelpDisplaySideButton({ direction, callBack, disabled }: HelpDisplaySideButtonProps) {
  return (
    <Button
      type={{ type: "button", callBack: () => callBack(direction) }}
      height={BUTTON_SIZE}
      width={BUTTON_SIZE}
      icon={
        direction === "left"
          ? <ChevronLeft height={CHEVRON_SIZE} width={CHEVRON_SIZE} />
          : <ChevronRight height={CHEVRON_SIZE} width={CHEVRON_SIZE} />
      }
      backgroundColor="#FFF5EE"
      disabled={disabled}
      boxShadow="0px 0px 4px 4px #C1C1C1"
    />
  )
}