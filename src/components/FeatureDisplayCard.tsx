import React, { CSSProperties } from "react"
import styles from "./FeatureDisplayCard.module.css"

interface imgProps {
  imgLink: string,
  height: string,
  width: string
}

interface FeatureDisplayCardProps {
  title: string,
  notes: string[],
  images: imgProps[],
  theme?: "dark" | "light",
}

// Uses Ref Forwarding to provide a ref access to the outer container div of this component to the parent
// that contains it
const FeatureDisplayCard = React.forwardRef<HTMLDivElement, FeatureDisplayCardProps>(({
  title,
  notes,
  images,
  theme = "light"
}, ref) => {
  let outerContainerStyles: CSSProperties = {}
  let titleStyles: CSSProperties = {}
  let noteStyles: CSSProperties = {}

  if (theme === "dark") {
    outerContainerStyles = { backgroundColor: "darkred" }
    titleStyles = { color: "white" }
    noteStyles = { color: "white" }
  }

  const notesList = notes.map((note) => <li style={noteStyles}>{note}</li>)
  const imgList = images.map(
    (image) => <img alt="None" src={image.imgLink} width={image.width} height={image.height} />
  )

  return (
    <div ref={ref} className={styles.outerContainer} style={outerContainerStyles}>
      <article className={styles.textContainer}>
        <h1 style={titleStyles}>{title}</h1>
        <ul>
          {notesList}
        </ul>
      </article>
      <div className={styles.imageContainer}>
        {imgList}
      </div>
    </div>
  )
})

export default FeatureDisplayCard