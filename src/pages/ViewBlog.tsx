import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer, { PageContainerState } from "../components/PageContainer";
import Api, { BlogProps } from "../lib/api/Api";
import styles from "./ViewBlog.module.css"

export default function ViewBlog() {
  const [blog, setBlog] = useState<BlogProps>()
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })

  const { blogId } = useParams()

  useEffect(() => {
    async function getBlog() {
      setPageState({ status: "loading" })

      if (!blogId) return setPageState({ status: "Error", errorCode: "400" })

      try {
        const response = await Api.getBlog(blogId)
        if (!("success" in response)) {
          console.error(response)
          return setPageState({ status: "Error", errorCode: response.code + "" })
        }

        // Successful response
        setBlog(response.success.blog as BlogProps)
      } catch (err) {
        // Something went wrong
        console.error(err)
        return setPageState({ status: "Error", errorCode: "500" })
      }

      // Blog was successfully retrieved without errors
      setPageState({ status: "normal" })
    }

    getBlog()
  }, [blogId])

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      ${blog?.html}
      <style>${blog?.css}</style>
    </html>
  `

  return (
    <PageContainer
      state={pageState}
      contentStyle={{ marginTop: "42px", marginBottom: "36px" }}
      contentBlockStyle={{ display: "flex", justifyContent: "center" }}
    >
      <iframe srcDoc={srcDoc} title="output" sandbox="" className={styles.frame} />
    </PageContainer>
  )
}