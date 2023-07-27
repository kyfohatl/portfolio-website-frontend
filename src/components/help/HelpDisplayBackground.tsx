import styles from "./HelpDisplayBackground.module.css"

interface HelpDisplayBackgroundProps {
  onClose: () => void
}

export default function HelpDisplayBackground({ onClose }: HelpDisplayBackgroundProps) {
  return (
    <div data-testid="helpDisplayBackground" className={styles.background} onClick={onClose}></div>
  )
}