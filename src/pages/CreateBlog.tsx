import { useEffect, useState } from "react";
import Editor from "../components/blog/Editor";
import PageContainer from "../components/PageContainer";

import styles from "./CreateBlog.module.css"

export default function CreateBlog() {
  const [html, setHtml] = useState("")
  const [css, setCss] = useState("")

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <body>${html}</body>
      <style>${css}</style>
    </html>
  `
  // useEffect(() => {

  // }, [html, css])

  return (
    <PageContainer
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", maxWidth: "80vw", maxHeight: "90vh", gap: "20px" }}
    >
      <div className={styles.topPane}>
        <Editor text={html} setText={setHtml} />
        <Editor text={css} setText={setCss} />
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