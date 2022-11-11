import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { TextInfo } from "../components/blog/Editor";
import Button, { ButtonState } from "../components/Button";
import PageContainer, { PageContainerState } from "../components/PageContainer";

import styles from "./EditBlog.module.css"
import { ReactComponent as SaveIcon } from "../assets/images/saveIcon.svg"
import Api, { BlogProps } from "../lib/api/Api";
import { useParams } from "react-router-dom";
import Saving from "../components/animation/Saving";
import HelpDisplay from "../components/help/HelpDisplay";
import { cardProps } from "../resources/editBlogHelpCards/cardContent";
import QuestionMark from "../components/animation/QuestionMark";
import HelpImage from "../assets/images/tutorial/editBlogTutorials/help.png"
import TutorialSequence from "../components/tutorial/TutorialSequence";


export default function EditBlog() {
  const [html, setHtml] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [css, setCss] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [saveButtonText, setSaveButtonText] = useState<"Create" | "Save">("Create")
  const [blog, setBlog] = useState<BlogProps>()
  const [blogId, setBlogId] = useState<string>()
  const [saveButtonState, setSaveButtonState] = useState<ButtonState>({ state: "normal" })
  const [showHelpDisplay, setShowHelpDisplay] = useState(false)
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(true)

  const helpBtnRef = useRef<HTMLDivElement>(null)

  const blogIdParam = useParams().blogId

  // Load blog content from database if editing an existing blog
  useEffect(() => {
    async function getBlog() {
      setPageState({ status: "loading" })

      if (blogIdParam) {
        // We are editing an existing blog
        try {
          const response = await Api.getBlog(blogIdParam)

          // Check for error response
          if (!("success" in response)) {
            console.error(response)
            setPageState({ status: "Error", errorCode: response.code + "" })
            return
          }

          // Successful response. Store blog properties
          setBlog(response.success.blog)
          setBlogId(response.success.blog.id)
          setHtml({ text: response.success.blog.html, change: { changeType: "Other" } })
          setCss({ text: response.success.blog.css, change: { changeType: "Other" } })
        } catch (err) {
          // Something went wrong
          console.error(err)
          setPageState({ status: "Error", errorCode: "500" })
          return
        }
      }

      // Blog successfully retrieved without error. Reset page state back to normal
      setPageState({ status: "normal" })
    }

    getBlog()
  }, [blogIdParam])

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
      ${html.text}
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

      // Ensure blog was successfully saved
      if (!("success" in response)) {
        console.error(response)
        setPageState({ status: "Error", errorCode: response.code + "" })
        return
      }

      // Set save button state to saving, and then back to normal
      setSaveButtonState({
        state: "animated",
        animation: <Saving onAnimationEnd={() => { setSaveButtonState({ state: "normal" }) }} />,
        text: "Saved"
      })
      // Save the returning blog id
      setBlogId(response.success.id)
    } catch (err) {
      // Something went wrong
      console.error(err)
      setPageState({ status: "Error", errorCode: "500" })
    }
  }, [html, css, blogId])

  // Opens the help display
  const onClickHelpBtn = useCallback(() => {
    setShowTutorial(false)
    setShowHelpDisplay(true)
  }, [])

  const HELP_BUTTON_SIZE = "38px"

  return (
    <PageContainer
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", maxWidth: "80vw", maxHeight: "95vh", gap: "20px" }}
      state={pageState}
      contentTestId="editBlogPage"
    >
      <div className={styles.savePane}>
        <div ref={helpBtnRef}>
          <Button
            type={{ type: "button", callBack: onClickHelpBtn }}
            icon={<QuestionMark width={HELP_BUTTON_SIZE} height={HELP_BUTTON_SIZE} />}
            height={HELP_BUTTON_SIZE}
            width={HELP_BUTTON_SIZE}
            padding="0px"
            borderRadius="50px"
            backgroundColor="transparent"
            btnTestId="helpMenuBtn"
          />
        </div>

        <Button
          text={saveButtonText}
          type={{ type: "button", callBack: onClickSave }}
          height="40px"
          width="100px"
          icon={<SaveIcon width={21} height={21} />}
          buttonState={saveButtonState}
          btnTestId="saveBtn"
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
          data-testid="outputWindow"
        />
      </div>

      {/* Logic for showing the help dialogue */}
      {showHelpDisplay
        ? <HelpDisplay cardProps={cardProps} onClose={() => setShowHelpDisplay(false)} />
        : null
      }

      {/* <TutorialPopup
        info={{
          target: helpBtnRef.current,
          xOffset: -200,
          yOffset: 100,
          title: "Tutorial",
          notes: "Click the help icon to find out more about writing blogs",
          image: HelpImage,
          imgAlt: "Edit blog help"
        }}
        shouldDisplay={showTutorial}
        id="tutorial"
        onClose={() => setShowTutorial(false)}
      /> */}
      <TutorialSequence
        popupProps={[
          {
            target: helpBtnRef.current,
            xOffset: -200,
            yOffset: 100,
            title: "Tutorial",
            notes: "Click the help icon to find out more about writing blogs",
            image: HelpImage,
            imgAlt: "Edit blog help",
          }
        ]}
        displayTutes={showTutorial}
        id="tutorial"
      />
    </PageContainer>
  )
}