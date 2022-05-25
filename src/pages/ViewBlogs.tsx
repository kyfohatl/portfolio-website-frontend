import { useCallback, useEffect, useRef, useState } from "react"
import BlogCard from "../components/blog/BlogCard"
import Loading from "../components/Loading"
import PageContainer, { PageContainerState } from "../components/PageContainer"
import useRefState from "../hooks/useRefState"
import Api, { BlogProps } from "../lib/api/Api"
import styles from "./ViewBlogs.module.css"

function getScrollPercentage() {
  const de = document.documentElement
  return de.scrollTop / (de.scrollHeight - de.clientHeight)
}

export default function ViewBlogs() {
  const [cards, setCards] = useState<JSX.Element[]>([])
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })
  const [loadingBlogsState, loadingBlogsRef, setLoadingBlogs] = useRefState(false)
  // True if there are no more blogs to show
  const [allBlogsShownState, allBlogsShownRef, setAllBlogsShown] = useRefState(false)

  // Number of blogs loaded
  const numBlogsRef = useRef(0)

  const getBlogs = useCallback(async (limit: number) => {
    if (numBlogsRef.current === 0) {
      // Initial loading of blogs, set whole page to loading
      setPageState({ status: "loading" })
    }

    try {
      const response = await Api.getRecentBlogs(numBlogsRef.current, limit)

      // Check for error response
      if (!("success" in response)) {
        if (response.code === 404) {
          // No more blogs to show
          setAllBlogsShown(true)
        } else {
          // Some other problem
          console.error(response)
          setPageState({ status: "Error", errorCode: response.code + "" })
        }

        return
      }

      // Successful response, store returned blogs
      const blogs: BlogProps[] = response.success.blogs
      setCards(prevCards => prevCards.concat(blogs.map((blog) => {
        return (
          <BlogCard
            title={blog.summaryTitle}
            description={blog.summaryDescription}
            image={blog.summaryImg}
            tags={blog.tags}
          />
        )
      })))

      // Keep track of the number of blogs currently loaded
      numBlogsRef.current += blogs.length
    } catch (err) {
      // Something went wrong
      console.error(err)
      setPageState({ status: "Error", errorCode: "500" })
      return
    }

    // Reset page state back to normal
    setPageState({ status: "normal" })
  }, [setAllBlogsShown])



  // Load blogs
  useEffect(() => {
    getBlogs(8)
  }, [getBlogs])

  useEffect(() => {
    async function onScroll() {
      if (!allBlogsShownRef.current && !loadingBlogsRef.current && getScrollPercentage() > 0.95) {
        // Display the loading indicator card
        setLoadingBlogs(true)
        // Get the nex batch of blogs
        await getBlogs(5)
        // Remove the loading indicator card
        setLoadingBlogs(false)
      }
    }

    // Add an event listener to keep track of user scrolling for loading in more articles
    window.addEventListener("scroll", onScroll)

    // Cleanup window scroll event listener
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [allBlogsShownRef, getBlogs, loadingBlogsRef, setLoadingBlogs])

  return (
    <PageContainer
      state={pageState}
      contentStyle={{ marginTop: "42px", marginBottom: "42px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", gap: "30px" }}
    >
      {allBlogsShownState && numBlogsRef.current === 0
        ? <p>No blogs to show</p>
        : cards
      }
      {loadingBlogsState
        ? <div className={styles.loadingCard}>
          <Loading overrideStyles={{ height: "200px", width: "200px" }} />
        </div>
        : null
      }
    </PageContainer>
  )
}