import React, { CSSProperties } from "react"
import styles from "./EditorTitle.module.css"

export type EditorType = "html" | "css"

interface EditorTitleProps {
  title: EditorType,
  onClickTitle?: (editor: EditorType) => void,
  containerStyleOverrides?: CSSProperties,
}

const EditorTitle = React.forwardRef<HTMLParagraphElement, EditorTitleProps>(({
  title,
  onClickTitle,
  containerStyleOverrides
}, ref) => {
  return (
    <div
      className={styles.title}
      {...(onClickTitle ? { onClick: () => onClickTitle(title) } : {})}
      style={containerStyleOverrides}
      data-testid={"editorTitle_" + title}
    >
      <p ref={ref}>{title.toUpperCase()}</p>
    </div>
  )
})

export default EditorTitle