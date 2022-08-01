import Button from "../Button"

import { ReactComponent as CloseIcon } from "../../assets/images/helpDisplay/closeIcon.svg"

interface HelpDisplayCloseButtonProps {
  onClose: () => void
}

const CLOSE_ICON_SIZE = "16px"
export const CLOSE_BUTTON_SIZE = "28px"

export default function HelpDisplayCloseButton({ onClose }: HelpDisplayCloseButtonProps) {
  return (
    <Button
      type={{ type: "button", callBack: onClose }}
      icon={<CloseIcon height={CLOSE_ICON_SIZE} width={CLOSE_ICON_SIZE} />}
      height={CLOSE_BUTTON_SIZE}
      width={CLOSE_BUTTON_SIZE}
      boxShadow="0px 0px 4px 4px #C1C1C1"
    />
  )
}