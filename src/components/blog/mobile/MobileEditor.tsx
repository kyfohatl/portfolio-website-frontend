import React, { CSSProperties, useCallback, useState } from "react"
import { EditorProps } from "../Editor"
import EditorBody from "../EditorBody"
import EditorTitle, { EditorType } from "../EditorTitle"
import styles from "./MobileEditor.module.css"

interface MobileEditorProps {
  html: EditorProps,
  css: EditorProps
}

const containerStyleOverrides: CSSProperties = {
  width: "100px",
  height: "40px",
  justifyContent: "center",
  padding: "0px"
}

const MobileEditor = React.forwardRef<HTMLParagraphElement, MobileEditorProps>((props, ref) => {
  const [actvEditor, setActvEditor] = useState<EditorType>("html")

  const onClickTitle = useCallback((editor: EditorType) => {
    if (editor !== actvEditor) setActvEditor(editor)
  }, [actvEditor])

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <EditorTitle
          title={props.html.title}
          onClickTitle={onClickTitle}
          containerStyleOverrides={{ marginLeft: "40px", ...containerStyleOverrides }}
          ref={ref}
        />
        <EditorTitle
          title={props.css.title}
          onClickTitle={onClickTitle}
          containerStyleOverrides={{ marginLeft: "0", ...containerStyleOverrides }}
        />
      </div>
      <div className={styles.bodyContainer}>
        <EditorBody
          title={actvEditor}
          textInfo={props[actvEditor].textInfo}
          setText={props[actvEditor].setText}
          containerStyleOverrides={{ borderRadius: "0px" }}
        />
      </div>
    </div>
  )
})

export default MobileEditor