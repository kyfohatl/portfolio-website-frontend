import { useCallback, useEffect, useState } from "react";
import Editor, { TextInfo } from "../components/blog/Editor";
import Button, { ButtonState } from "../components/Button";
import PageContainer from "../components/PageContainer";

import styles from "./EditBlog.module.css"
import { ReactComponent as SaveIcon } from "../assets/images/saveIcon.svg"
import Api, { BlogProps } from "../lib/api/Api";
import { useParams } from "react-router-dom";


export default function EditBlog() {
  const [html, setHtml] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [css, setCss] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [saveButtonText, setSaveButtonText] = useState<"Create" | "Save">("Create")
  const [blog, setBlog] = useState<BlogProps>()
  const [blogId, setBlogId] = useState(useParams().blogId)
  const [saveButtonState, setSaveButtonState] = useState<ButtonState>({ state: "normal" })
  const [loading, setLoading] = useState(false)

  // Load blog content from database
  useEffect(() => {
    async function getBlog() {
      if (blogId) {
        // We are editing an existing blog
        try {
          const response = await Api.getBlog(blogId)

          // TODO
          if (!response.success) return console.error(response?.error)

          // Successful response. Store blog properties
          setBlog(response.success.blog)
          setHtml({ text: response.success.blog.html, change: { changeType: "Other" } })
          setCss({ text: response.success.blog.css, change: { changeType: "Other" } })
        } catch (err) {
          // TODO
          console.error(err)
        }
      }
    }

    setLoading(true)
    getBlog()
    setLoading(false)
  }, [blogId])

  // Change the "Create" button to "Save" if an exiting blog is being edited
  useEffect(() => {
    if (blogId || blog) {
      setSaveButtonText("Save")
    } else {
      setSaveButtonText("Create")
    }
  }, [blogId, blog])

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <body>${html.text}</body>
      <style>${css.text}</style>
    </html>
  `

  // Save changes to the blog if editing an existing blog, or create a new blog
  const onClickSave = useCallback(async () => {
    // Set save button state to loading
    setSaveButtonState({ state: "loading" })

    // Now try to save changes
    try {
      const response = await Api.saveBlog(html.text, css.text, blogId)
      // TODO
      if (response.error || !response.success) return console.error(response.error)
      // Set save button state to saving, and then back to normal
      setSaveButtonState({ state: "saving", onAnimationEnd: () => { setSaveButtonState({ state: "normal" }) } })
      // Save the returning blog id
      setBlogId(response.success.id)
    } catch (err) {
      // TODO
      console.error(err)
    }
  }, [html, css, blogId])

  return (
    <PageContainer
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", maxWidth: "80vw", maxHeight: "95vh", gap: "20px" }}
      loading={loading}
    >
      <div className={styles.savePane}>
        <Button
          text={saveButtonText}
          type={{ type: "button", callBack: onClickSave }}
          height="40px"
          width="100px"
          icon={<SaveIcon width={21} height={21} />}
          buttonState={saveButtonState}
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