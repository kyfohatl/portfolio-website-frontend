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
  boxShadow?: string,
  middleGap?: string,
  textLineSize?: string,
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
  boxShadow,
  middleGap,
  textLineSize
}, ref) => {
  let outerContainerStyles: CSSProperties = {
    ...(dimensions),
    ...(borderRadius && { borderRadius: borderRadius }),
    ...(boxShadow && { boxShadow: boxShadow }),
    ...(middleGap && { gap: middleGap })
  }
  let titleStyles: CSSProperties = {}
  let noteStyles: CSSProperties = {}
  const textContainerStyles: CSSProperties = {
    ...(textLineSize && { maxWidth: textLineSize })
  }

  if (theme === "dark") {
    outerContainerStyles.backgroundColor = "darkred"
    titleStyles = { color: "white" }
    noteStyles = { color: "white" }
  }

  // Create list of notes
  const notesList = notes.map((note, index) => <li key={index} style={noteStyles}>{note}</li>)
  // Create a list of images if images are given
  let imgList: JSX.Element[] = []
  if ("images" in visuals) {
    imgList = visuals.images.map(
      (image, index) => <img key={index} alt="None" src={image.imgLink} width={image.width} height={image.height} />
    )
  }

  return (
    <div
      ref={ref}
      className={styles.outerContainer}
      style={outerContainerStyles}
      data-testid={`featureDisplay_${title}`}
    >
      <article className={styles.textContainer} style={textContainerStyles}>
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