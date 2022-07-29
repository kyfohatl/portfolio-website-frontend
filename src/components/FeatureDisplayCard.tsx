import React, { CSSProperties } from "react"
import styles from "./FeatureDisplayCard.module.css"

interface imgProps {
  imgLink: string,
  height: string,
  width: string
}

export interface FeatureDisplayCardProps {
  title: string,
  notes: string[],
  visuals: { images: imgProps[] } | { custom: JSX.Element },
  theme?: "dark" | "light",
  dimensions?: { width: string, height: string }
  borderRadius?: string,
  boxShadow?: string
}

// Uses Ref Forwarding to provide a ref access to the outer container div of this component to the parent
// that contains it
const FeatureDisplayCard = React.forwardRef<HTMLDivElement, FeatureDisplayCardProps>(({
  title,
  notes,
  visuals,
  theme = "light",
  dimensions,
  borderRadius,
  boxShadow
}, ref) => {
  let outerContainerStyles: CSSProperties = {
    ...(dimensions),
    ...(borderRadius && { borderRadius: borderRadius }),
    ...(boxShadow && { boxShadow: boxShadow })
  }
  let titleStyles: CSSProperties = {}
  let noteStyles: CSSProperties = {}

  if (theme === "dark") {
    outerContainerStyles.backgroundColor = "darkred"
    titleStyles = { color: "white" }
    noteStyles = { color: "white" }
  }

  // Create list of notes
  const notesList = notes.map((note) => <li style={noteStyles}>{note}</li>)
  // Create a list of images if images are given
  let imgList: JSX.Element[] = []
  if ("images" in visuals) {
    imgList = visuals.images.map(
      (image) => <img alt="None" src={image.imgLink} width={image.width} height={image.height} />
    )
  }

  return (
    <div ref={ref} className={styles.outerContainer} style={outerContainerStyles}>
      <article className={styles.textContainer}>
        <h1 style={titleStyles}>{title}</h1>
        <ul>
          {notesList}
        </ul>
      </article>
      <div className={styles.imageContainer}>
        {"images" in visuals
          ? imgList
          : visuals.custom
        }
      </div>
    </div>
  )
})

export default FeatureDisplayCard