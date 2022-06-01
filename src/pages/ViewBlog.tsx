import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button, { ButtonState } from "../components/Button";
import PageContainer, { PageContainerState } from "../components/PageContainer";
import Api, { BlogProps } from "../lib/api/Api";
import styles from "./ViewBlog.module.css"

import { ReactComponent as EditIcon } from "../assets/images/editIcon.svg"
import { ReactComponent as DeleteIcon } from "../assets/images/deleteIcon.svg"
import { BackendError } from "../lib/commonTypes";
import Deleting from "../components/animation/Deleting";

export default function ViewBlog() {
  const [blog, setBlog] = useState<BlogProps>()
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })
  const [userCanEdit, setUserCanEdit] = useState(false)
  // Button states
  const [editButtonState, setEditButtonState] = useState<ButtonState>({ state: "normal" })
  const [deleteButtonState, setDeleteButtonState] = useState<ButtonState>({ state: "normal" })
  // Button enabled/disabled states
  const [editButtonDisabled, setEditButtonDisabled] = useState(false)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false)

  const { blogId } = useParams()

  // Load in the blog
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

  useEffect(() => {
    // Ensure a blog was fetched
    if (!blog) return

    // If the logged in user is the user that created this blog, display edit controls
    const userId = localStorage.getItem("userId")
    if (userId && userId === blog.userId) setUserCanEdit(true)
  }, [blog])

  const navigate = useNavigate()

  const onClickEdit = useCallback(() => {
    if (!blog) return setPageState({ status: "Error", errorCode: 400 + "" })

    setEditButtonState({ state: "loading" })
    setDeleteButtonDisabled(true)

    navigate("/editblog/" + blog.id)
  }, [blog, navigate])

  const onDeleteAnimationEnd = useCallback(() => {
    navigate("/viewblogs")
  }, [navigate])

  const onClickDelete = useCallback(async () => {
    if (!blogId) return setPageState({ status: "Error", errorCode: 400 + "" })

    setDeleteButtonState({ state: "loading" })
    setEditButtonDisabled(true)

    try {
      await Api.deleteBlog(blogId)
      // Show deletion animation, then redirect to the blogs page
      setDeleteButtonState({
        state: "animated",
        animation: <Deleting onAnimationEnd={onDeleteAnimationEnd} />
      })
    } catch (err) {
      const castError = err as BackendError
      setPageState({ status: "Error", errorCode: castError.code + "" })
      console.error(err)
    }
  }, [blogId, onDeleteAnimationEnd])

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
      contentBlockStyle={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}
    >
      {userCanEdit
        ?
        <div className={styles.buttonContainer}>
          <Button
            text="Edit"
            type={{ type: "button", callBack: onClickEdit }}
            backgroundColor="#8B0000"
            height="36px"
            width="100px"
            icon={<EditIcon width={21} height={21} />}
            buttonState={editButtonState}
            disabled={editButtonDisabled}
          />
          <Button
            text="Delete"
            type={{ type: "button", callBack: onClickDelete }}
            backgroundColor="#4267B2"
            height="36px"
            width="100px"
            icon={<DeleteIcon width={21} height={21} />}
            buttonState={deleteButtonState}
            disabled={deleteButtonDisabled}
          />
        </div>
        :
        null
      }
      <iframe srcDoc={srcDoc} title="output" sandbox="" className={styles.frame} />
    </PageContainer>
  )
}