import styles from "./TutorialCard.module.css"
import TutorialCardCloseButton from "./TutorialCardCloseButton"

interface TutorialCardProps {
  title: string,
  notes: string,
  image: string,
  imgAlt: string,
  imgWidth: string,
  imgHeight: string,
  pos: { right: string, top: string },
  onClose: () => void
}

export default function TutorialCard({
  title,
  notes,
  image,
  imgAlt,
  imgWidth,
  imgHeight,
  pos,
  onClose
}: TutorialCardProps) {
  return (
    <div className={styles.outerContainer} style={{ position: "fixed", right: pos.right, top: pos.top }}>
      <div className={styles.btnContainer}>
        <TutorialCardCloseButton onClose={onClose} />
      </div>
      <div className={styles.contentContainer}>
        <article className={styles.textContainer}>
          <h3>{title}</h3>
          <p>{notes}</p>
        </article>
        <div className={styles.imageContainer}>
          <img src={image} width={imgWidth} height={imgHeight} alt={imgAlt} />
        </div>
      </div>
    </div>
  )
}