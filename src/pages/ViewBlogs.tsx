import { useEffect, useState } from "react"
import BlogCard from "../components/blog/BlogCard"
import PageContainer, { PageContainerState } from "../components/PageContainer"
import Api, { BlogProps } from "../lib/api/Api"
import styles from "./ViewBlogs.module.css"

export default function ViewBlogs() {
  const [cards, setCards] = useState<JSX.Element[]>([])
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })

  // Load blogs
  useEffect(() => {
    async function getBlogs() {
      setPageState({ status: "loading" })

      try {
        const response = await Api.getRecentBlogs(0, 8)
        console.log(response)

        // Check for error response
        if (!("success" in response)) {
          console.error(response)
          setPageState({ status: "Error", errorCode: response.code + "" })
          return
        }

        // Successful response, store returned blogs
        const blogs: BlogProps[] = response.success.blogs
        setCards(blogs.map((blog) => {
          return (
            <BlogCard title={blog.summaryTitle} description={blog.summaryDescription} image={blog.summaryImg} />
          )
        }))
      } catch (err) {
        // Something went wrong
        console.error(err)
        setPageState({ status: "Error", errorCode: "500" })
        return
      }

      // Reset page state back to normal
      setPageState({ status: "normal" })
    }

    getBlogs()
  }, [])

  return (
    <PageContainer
      state={pageState}
      contentStyle={{ marginTop: "42px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", gap: "30px" }}
    >
      {cards}
    </PageContainer>
  )
}