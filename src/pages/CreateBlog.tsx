import { useCallback, useState } from "react";
import Editor, { TextInfo } from "../components/blog/Editor";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

import styles from "./CreateBlog.module.css"
import { ReactComponent as SaveIcon } from "../assets/images/saveIcon.svg"
import Api from "../lib/api/Api";


export default function CreateBlog() {
  const [html, setHtml] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [css, setCss] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <body>${html.text}</body>
      <style>${css.text}</style>
    </html>
  `

  const onClickSave = useCallback(() => {
    Api.saveBlog(html.text, css.text)
  }, [html, css])

  return (
    <PageContainer
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", maxWidth: "80vw", maxHeight: "95vh", gap: "20px" }}
    >
      <div>
        <Button
          text="Save"
          type={{ type: "button", callBack:  onClickSave}}
          height="40px"
          width="100px"
          icon={<SaveIcon width={21} height={21} />}
        />
      </div>
      <div className={styles.topPane}>
        <Editor textInfo={html} setText={setHtml} title="HTML" />
        <Editor textInfo={css} setText={setCss} title="CSS" />
      </div>
      <div className={styles.botPane}>
        <iframe
          className={styles.output}
          srcDoc={srcDoc}
          title="output"
          sandbox=""
        />
      </div>
    </PageContainer>
  )
}