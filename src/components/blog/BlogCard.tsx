import styles from "./BlogCard.module.css"
import MissingImageIcon from "../../assets/images/noImageIcon.png"
import { Link } from "react-router-dom"

interface BlogCardProps {
  link: string,
  title?: string,
  description?: string,
  image?: string,
  imageDescription?: string,
  tags?: string[]
}

export default function BlogCard({
  link,
  title = "No Title",
  description = "No Summary",
  image,
  imageDescription = "",
  tags }: BlogCardProps) {
  let wrappedTags: JSX.Element[] = []
  if (tags && tags.length > 0) {
    wrappedTags = tags.map((tag, index) => { return <span key={index} className={styles.tag}>{tag}</span> })
  }

  return (
    <Link className={styles.link} to={link}>
      <div className={styles.outerContainer} data-testid={`blogCard_${title}`}>
        {image
          ? <img className={styles.thumbnail} src={image} alt={imageDescription} />
          : <img className={styles.thumbnail} src={MissingImageIcon} alt="Missing" />
        }
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{title}</h2>
          {tags && <div data-testid="tagContainer" className={styles.tagContainer}>{wrappedTags}</div>}
          <p className={styles.summary}>{description}</p>
        </div>
      </div>
    </Link>
  )
}