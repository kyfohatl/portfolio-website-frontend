import React from "react"
import styles from "./Editor.module.css"
import EditorBody, { TextInfo } from "./EditorBody"
import EditorTitle, { EditorType } from "./EditorTitle"

export interface EditorProps {
  textInfo: TextInfo,
  setText: (textInfo: TextInfo) => void,
  title: EditorType
}

const Editor = React.forwardRef<HTMLParagraphElement, EditorProps>(({
  textInfo,
  setText,
  title
}, ref) => {
  return (
    <div className={styles.outerContainer} data-testid={`${title.toUpperCase()}Editor`}>
      <EditorTitle title={title} ref={ref} />
      <EditorBody
        title={title.toUpperCase()}
        textInfo={textInfo}
        setText={setText}
        testId={"desktopEditor_" + title}
      />
    </div>
  )
})

export default Editor