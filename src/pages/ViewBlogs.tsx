import { useCallback, useEffect, useState } from "react"
import BlogCard from "../components/blog/BlogCard"
import Loading from "../components/Loading"
import PageContainer, { PageContainerState } from "../components/PageContainer"
import Api, { BlogProps } from "../lib/api/Api"
import styles from "./ViewBlogs.module.css"

function getScrollPercentage() {
  const de = document.documentElement
  return de.scrollTop / (de.scrollHeight - de.clientHeight)
}

const initialNumBlogsToLoad = 8

export default function ViewBlogs() {
  const [cards, setCards] = useState<JSX.Element[]>([])
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })
  const [moreBlogsLoading, setMoreBlogsLoading] = useState(false)
  const [numBlogsLoaded, setNumBlogsLoaded] = useState(0)

  // Load blogs
  useEffect(() => {
    async function getBlogs(pageNum: number, limit: number) {
      setPageState({ status: "loading" })

      try {
        const response = await Api.getRecentBlogs(pageNum, limit)

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
            <BlogCard
              title={blog.summaryTitle}
              description={blog.summaryDescription}
              image={blog.summaryImg}
              tags={blog.tags}
            />
          )
        }))

        // Keep track of the number of blogs currently loaded
        setNumBlogsLoaded(pageNum + limit)
      } catch (err) {
        // Something went wrong
        console.error(err)
        setPageState({ status: "Error", errorCode: "500" })
        return
      }

      // Reset page state back to normal
      setPageState({ status: "normal" })
    }

    async function onScroll() {
      if (getScrollPercentage() > 0.95) {
        // Display the loading indicator card
        setMoreBlogsLoading(true)
        // Get the nex batch of blogs
        getBlogs(numBlogsLoaded, 5)
      }
    }

    // Add an event listener to keep track of user scrolling for loading in more articles
    window.addEventListener("scroll", onScroll)

    // Get articles
    getBlogs(0, initialNumBlogsToLoad)

    // Cleanup window scroll event listener
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <PageContainer
      state={pageState}
      contentStyle={{ marginTop: "42px", marginBottom: "42px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", gap: "30px" }}
    >
      {cards}
      {moreBlogsLoading
        ? <div className={styles.loadingCard}>
          <Loading overrideStyles={{ height: "200px", width: "200px" }} />
        </div>
        : null
      }
    </PageContainer>
  )
}