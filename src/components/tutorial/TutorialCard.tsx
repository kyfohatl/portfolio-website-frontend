import styles from "./TutorialCard.module.css"
import TutorialCardCloseButton from "./TutorialCardCloseButton"

interface TutorialCardProps {
  title: string,
  notes: string,
  image: string,
  imgAlt: string,
  pos: { left: string, top: string },
  onClose: () => void
}

export default function TutorialCard({ title, notes, image, imgAlt, pos, onClose }: TutorialCardProps) {
  return (
    <div className={styles.outerContainer} style={{ position: "fixed", left: pos.left, top: pos.top }}>
      <div className={styles.btnContainer}>
        <TutorialCardCloseButton onClose={onClose} />
      </div>
      <div className={styles.contentContainer}>
        <article className={styles.textContainer}>
          <h3>{title}</h3>
          <p>{notes}</p>
        </article>
        <div className={styles.imageContainer}>
          <img src={image} width="142px" height="100px" alt={imgAlt} />
        </div>
      </div>
    </div>
  )
}