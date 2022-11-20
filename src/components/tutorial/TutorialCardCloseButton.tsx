import Button from "../Button";
import { ReactComponent as CloseIcon } from "../../assets/images/helpDisplay/closeIcon.svg"

interface TutorialCardCloseButtonProps {
  onClose: () => void
}

const CLOSE_ICON_SIZE = "16px"
const CLOSE_BUTTON_SIZE = "28px"

export default function TutorialCardCloseButton({ onClose }: TutorialCardCloseButtonProps) {
  return (
    <Button
      type={{ type: "button", callBack: onClose }}
      icon={<CloseIcon width={CLOSE_ICON_SIZE} height={CLOSE_ICON_SIZE} strokeWidth="4" />}
      width={CLOSE_BUTTON_SIZE}
      height={CLOSE_BUTTON_SIZE}
      borderRadius="6px"
    />
  )
}