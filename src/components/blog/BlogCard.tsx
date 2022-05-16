import styles from "./BlogCard.module.css"
import MissingImageIcon from "../../assets/images/noImageIcon.png"

interface BlogCardProps {
  title?: string,
  description?: string,
  image?: string,
  imageDescription?: string,
  tags?: string[]
}

export default function BlogCard({
  title = "No Title",
  description = "No Summary",
  image,
  imageDescription = "",
  tags }: BlogCardProps) {
  let wrappedTags: JSX.Element[] = []
  if (tags && tags.length > 0) {
    wrappedTags = tags.map((tag) => { return <span className={styles.tag}>{tag}</span> })
  }

  return (
    <div className={styles.outerContainer}>
      {image
        ? <img className={styles.thumbnail} src={image} alt={imageDescription} />
        : <img className={styles.thumbnail} src={MissingImageIcon} alt="None" />
      }
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        {tags && <div className={styles.tagContainer}>{wrappedTags}</div>}
        <p className={styles.summary}>{description}</p>
      </div>
    </div>
  )
}