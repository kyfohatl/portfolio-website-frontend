import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "../components/blog/Editor";
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
import SignInImg from "../assets/images/tutorial/editBlogTutorials/signin.png"
import HtmlImage from "../assets/images/tutorial/editBlogTutorials/html.png"
import TutorialSequence from "../components/tutorial/TutorialSequence";
import { hasData } from "../lib/api/helpers/auth/redirectAndClearData";
import { TutorialPopupInfo } from "../components/tutorial/TutorialPopup";
import Tooltip from "../components/tooltip/Tooltip";
import { TextInfo } from "../components/blog/EditorBody";
import MobileEditor from "../components/blog/mobile/MobileEditor";

export const EDIT_BLOG_TITLE = "Edit Your Blog"
export const CREATE_BLOG_TITLE = "Create A Blog"

const HTML_TITLE = "HTML"
const CSS_TITLE = "CSS"

function makeOnTextChange(
  setter: (newVal: TextInfo) => void,
  routeParams: string | undefined,
  blogId: string | undefined,
  key: string
) {
  return (newVal: TextInfo) => {
    // Set the new value with the setter
    setter(newVal)
    // If not editing an existing blog, store unsaved changes
    if (!routeParams && !blogId) localStorage.setItem(`unsaved_${key}_Content`, newVal.text)
  }
}


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
  const [showBasicTute, setShowBasicTute] = useState(true)
  const [showHtmlTute, setShowHtmlTute] = useState(false)
  const [popupProps, setPopupProps] = useState<TutorialPopupInfo[]>([])

  const helpBtnRef = useRef<HTMLDivElement>(null)
  const loginBtnRef = useRef<HTMLLIElement>(null)
  const htmlTitleRef = useRef<HTMLDivElement>(null)

  const blogIdParam = useParams().blogId

  // If the user is not logged in, show additional tutorials
  useEffect(() => {
    const helpDisplayTute: TutorialPopupInfo = {
      target: helpBtnRef.current,
      xOffset: -200,
      yOffset: 100,
      title: "Help",
      notes: "Click the help icon to find out more about writing blogs",
      image: HelpImage,
      imgAlt: "Edit blog help",
      imgWidth: "142px",
      imgHeight: "100px",
      cardTestId: "basicHelp"
    }

    if (hasData()) return setPopupProps([helpDisplayTute])

    // User is not signed in, show additional tutorials
    setPopupProps([
      helpDisplayTute,
      {
        target: loginBtnRef.current,
        xOffset: -100,
        yOffset: 200,
        title: "Login",
        notes: "Login or create a account to save your work",
        image: SignInImg,
        imgAlt: "Sign in to save",
        imgWidth: "103px",
        imgHeight: "110px",
        cardTestId: "loginHelp"
      }
    ])
  }, [])

  // Load blog content from database if editing an existing blog
  // If creating a new blog, check for unsaved content and load that
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
      } else {
        // We are creating a new blog
        // Check if the user is already editing a blog and if so, place the content in the editors
        const unsavedHtml = localStorage.getItem(`unsaved_${HTML_TITLE}_Content`)
        const unsavedCss = localStorage.getItem(`unsaved_${CSS_TITLE}_Content`)

        if (unsavedHtml) setHtml({ text: unsavedHtml, change: { changeType: "Other" } })
        if (unsavedCss) setCss({ text: unsavedCss, change: { changeType: "Other" } })
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
    if (!html.text) {
      // The user has not created any HTML. Do not save the blog, and show a tutorial instead
      setShowHtmlTute(true)
      return
    }

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
      // If there is any content tagged as "unsaved" in local storage, clear it
      localStorage.removeItem(`unsaved_${HTML_TITLE}_Content`)
      localStorage.removeItem(`unsaved_${CSS_TITLE}_Content`)
    } catch (err) {
      // Something went wrong
      console.error(err)
      setPageState({ status: "Error", errorCode: "500" })
    }
  }, [html, css, blogId])

  // Opens the help display
  const onClickHelpBtn = useCallback(() => {
    setShowBasicTute(false)
    setShowHtmlTute(false)
    setShowHelpDisplay(true)
  }, [])

  const onHtmlChange = useMemo(() => makeOnTextChange(setHtml, blogIdParam, blogId, HTML_TITLE), [blogIdParam, blogId])
  const onCssChange = useMemo(() => makeOnTextChange(setCss, blogIdParam, blogId, CSS_TITLE), [blogIdParam, blogId])

  const HELP_BUTTON_SIZE = "38px"

  return (
    <PageContainer
      {...(blogIdParam ? { title: EDIT_BLOG_TITLE } : { title: CREATE_BLOG_TITLE })}
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", flexDirection: "column", maxWidth: "80vw", maxHeight: "95vh", gap: "20px" }}
      state={pageState}
      contentTestId="editBlogPage"
      navbarLoginBtnRef={loginBtnRef}
    >
      <div className={styles.savePane}>
        <div ref={helpBtnRef}>
          <Tooltip text="Help" testId="helpTooltip">
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
          </Tooltip>
        </div>

        {/* Show the "Save" button as disabled, and display a tooltip, if the user is not signed in */}
        {
          hasData()
            ?
            <Button
              text={saveButtonText}
              type={{ type: "button", callBack: onClickSave }}
              height="40px"
              width="100px"
              icon={<SaveIcon width={21} height={21} />}
              buttonState={saveButtonState}
              btnTestId="saveBtn"
            />
            :
            <Tooltip text="Sign in to save your work!" testId="saveTooltip">
              <Button
                text={saveButtonText}
                type={{ type: "button", callBack: onClickSave }}
                height="40px"
                width="100px"
                icon={<SaveIcon width={21} height={21} />}
                buttonState={saveButtonState}
                btnTestId="saveBtn"
                disabled={true}
              />
            </Tooltip>
        }
      </div>
      <div className={styles.topPaneDesktop}>
        <Editor
          textInfo={html}
          setText={onHtmlChange}
          title={"html"}
          ref={htmlTitleRef}
        />
        <Editor
          textInfo={css}
          setText={onCssChange}
          title={"css"}
        />
      </div>
      <div className={styles.topPaneMobile}>
        <MobileEditor
          html={{ title: "html", textInfo: html, setText: onHtmlChange }}
          css={{ title: "css", textInfo: css, setText: onCssChange }}
        />
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

      <TutorialSequence
        popupProps={popupProps}
        shouldDisplay={showBasicTute}
        setShouldDisplay={setShowBasicTute}
        id="basic"
      />
      <TutorialSequence
        popupProps={[{
          target: htmlTitleRef.current,
          xOffset: 200,
          yOffset: 150,
          title: "Save",
          notes: "Write some HTML before saving!",
          image: HtmlImage,
          imgWidth: "145px",
          imgHeight: "57px",
          imgAlt: "Write some HTML before saving!",
          cardTestId: "htmlHelp"
        }]}
        shouldDisplay={showHtmlTute}
        setShouldDisplay={setShowHtmlTute}
        id="HTML"
        displayOnce={false}
      />
    </PageContainer>
  )
}