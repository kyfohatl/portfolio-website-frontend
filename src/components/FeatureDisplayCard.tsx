import React, { CSSProperties } from "react"
import styles from "./FeatureDisplayCard.module.css"

interface imgProps {
  imgLink: string,
  height: string,
  width: string
}

export interface FeatureDisplayCardProps {
  title: string,
  notes: (string | JSX.Element)[],
  visuals: { images: imgProps[] } | { custom: JSX.Element },
  theme?: "dark" | "light",
  dimensions?: { desktop: { w: string, h: string }, mobile: { w: string, h: string } }
  borderRadius?: string,
  boxShadow?: string,
  middleGap?: string,
  textLineSize?: string,
  noteListStyle?: "default" | "borders"
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
  textLineSize,
  noteListStyle = "default"
}, ref) => {
  let outerContainerStyles: CSSProperties = {
    ...(
      dimensions
        ? {
          "--width-desktop": dimensions.desktop.w,
          "--height-desktop": dimensions.desktop.h,
          "--width-mobile": dimensions.mobile.w,
          "--height-mobile": dimensions.mobile.h
        }
        : {}
    ),
    ...(borderRadius && { borderRadius: borderRadius }),
    ...(boxShadow && { boxShadow: boxShadow }),
    ...(middleGap && { gap: middleGap }),
    ...(
      theme === "dark"
        ? { "--link-normal-color": "yellow", "--link-visited-color": "lime" }
        : { "--link-normal-color": "blue", "--link-visited-color": "purple" }
    )
  }

  let listStyles: CSSProperties = {
    ...(
      noteListStyle === "borders"
        ? {
          listStyle: "none"
        }
        : {}
    )
  }

  let titleStyles: CSSProperties = {
    ...(
      noteListStyle === "borders"
        ? {
          border: "solid 3px",
          borderColor: "transparent transparent #bebebe transparent"
        }
        : {}
    )
  }

  let noteStyles: CSSProperties = {
    ...(
      noteListStyle === "borders"
        ? {
          border: "solid 3px",
          borderColor: "transparent transparent #bebebe transparent"
        }
        : {}
    )
  }

  const textContainerStyles: CSSProperties = {
    ...(textLineSize && { "--max-text-width-desktop": textLineSize } as CSSProperties)
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
        <ul style={listStyles}>
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