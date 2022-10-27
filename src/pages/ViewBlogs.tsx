import { useCallback, useEffect, useRef, useState } from "react"
import BlogCard from "../components/blog/BlogCard"
import Button, { ButtonState } from "../components/Button"
import Loading from "../components/Loading"
import PageContainer, { PageContainerState } from "../components/PageContainer"
import useRefState from "../hooks/useRefState"
import Api, { BlogProps } from "../lib/api/Api"
import styles from "./ViewBlogs.module.css"

import { ReactComponent as CreateIcon } from "../assets/images/createIcon.svg"
import { useNavigate } from "react-router-dom"
import { hasData } from "../lib/api/helpers/auth/redirectAndClearData"
import { NUM_ADDITIONAL_BLOGS, NUM_INIT_BLOGS } from "../resources/ViewBlogsConstants"

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
  // Create new blog button state
  const [createButtonState, setCreateButtonState] = useState<ButtonState>({ state: "normal" })

  // Navigation
  const navigate = useNavigate()

  // Number of blogs loaded
  const numBlogsRef = useRef(0)

  // Function to load the given number of blogs
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
          // Ensure that the page state is back to normal
          setPageState({ status: "normal" })
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
            link={`/blog/${blog.id}`}
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

  // Load initial blogs
  useEffect(() => {
    getBlogs(NUM_INIT_BLOGS)
  }, [getBlogs])

  // Load more blogs upon scrolling to the bottom of the page, if more blogs are available
  useEffect(() => {
    async function onScroll() {
      if (!allBlogsShownRef.current && !loadingBlogsRef.current && getScrollPercentage() > 0.95) {
        // Display the loading indicator card
        setLoadingBlogs(true)
        // Get the nex batch of blogs
        await getBlogs(NUM_ADDITIONAL_BLOGS)
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

  // Redirects to the create blog page
  const onClickCreate = useCallback(() => {
    setCreateButtonState({ state: "loading" })
    navigate("/editblog")
  }, [navigate])

  return (
    <PageContainer
      state={pageState}
      contentStyle={{ marginTop: "42px", marginBottom: "42px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", gap: "26px", alignItems: "flex-end" }}
      contentTestId="viewBlogsPage"
    >
      {hasData()
        ?
        <Button
          text="Create a new blog"
          type={{ type: "button", callBack: onClickCreate }}
          backgroundColor="#8B0000"
          color="#FFFFFF"
          icon={<CreateIcon width={21} height={21} />}
          width="158px"
          height="40px"
          buttonState={createButtonState}
          btnTestId="createBlogBtn"
        />
        :
        null
      }
      <div className={styles.blogsContainer}>
        {allBlogsShownState && numBlogsRef.current === 0
          ? <p data-testid="noBlogsTxt">No blogs to show!</p>
          : cards
        }
        {loadingBlogsState
          ? <div className={styles.loadingCard}>
            <Loading overrideStyles={{ height: "200px", width: "200px" }} />
          </div>
          : null
        }
      </div>
    </PageContainer>
  )
}