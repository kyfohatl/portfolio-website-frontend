import "./SignUp.css"

import React, { useCallback, useState } from "react"
import AuthContainer from "../components/auth/AuthContainer"
import InputText from "../components/auth/InputText"
import Button, { ButtonState } from "../components/Button"
import PageContainer, { PageContainerState } from "../components/PageContainer"
import { useNavigate } from "react-router-dom"
import Api from "../lib/api/Api"

export const EMAIL_ERR_MSSG = "A valid email is required!"
export const PASS_ERR_MSSG = "A valid password is required!"
export const CONF_PASS_ERR_MSSG = "Passwords must match!"

export default function SignUp() {
  // User inputs
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confPass, setConfPass] = useState("")
  // Error messages
  const [emailErrMssg, setEmailErrMssg] = useState("")
  const [passErrMssg, setPassErrMssg] = useState("")
  const [confPassErrMssg, setConfPassErrMssg] = useState("")
  // Button state
  const [signUpState, setSignUpState] = useState<ButtonState>({ state: "normal" })
  // Page state
  const [pageState, setPageState] = useState<PageContainerState>({ status: "normal" })

  const navigate = useNavigate()

  const onSubmit = useCallback(async (event: React.FormEvent) => {
    // Prevent default form behavior
    event.preventDefault()

    // Check for input errors
    if (!email) {
      setEmailErrMssg(EMAIL_ERR_MSSG)
      return
    } else {
      setEmailErrMssg("")
    }
    if (!pass) {
      setPassErrMssg(PASS_ERR_MSSG)
      return
    } else {
      setPassErrMssg("")
    }
    if (pass !== confPass) {
      setConfPassErrMssg(CONF_PASS_ERR_MSSG)
      return
    } else {
      setConfPassErrMssg("")
    }

    // No input errors detected
    // Set button to loading state
    setSignUpState({ state: "loading" })

    try {
      // Post new user
      const response = await Api.signUp(email, pass)

      if (!("success" in response)) {
        if ("complexError" in response) {
          // Set the new error message
          setEmailErrMssg(response.complexError.email)
          // Set button back to normal state
          setSignUpState({ state: "normal" })
        } else {
          // Something went wrong
          console.error(response)
          setPageState({ status: "Error", errorCode: "500" })
        }
      } else {
        // New user was created
        // Store the user id
        localStorage.setItem("userId", response.success.userId)

        // TODO: Redirect to user profile/home page when that page is ready
        // Navigate to home page
        navigate("/")
      }
    } catch (err) {
      // Could not fetch
      console.error(err)
      setPageState({ status: "Error", errorCode: "500" })
    }
  }, [email, pass, confPass, navigate])

  return (
    <PageContainer
      contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      contentBlockStyle={{ display: "flex", justifyContent: "center" }}
      state={pageState}
      contentTestId="signUpPage"
    >
      <AuthContainer title="Sign up" onSubmit={onSubmit}>
        <InputText
          label="Email"
          text={email}
          setText={setEmail}
          errorText={emailErrMssg}
        />
        <InputText
          label="Password"
          text={pass}
          type="password"
          setText={setPass}
          errorText={passErrMssg}
        />
        <InputText
          label="Confirm Password"
          text={confPass}
          type="password"
          setText={setConfPass}
          errorText={confPassErrMssg}
        />
        <Button
          type={{ type: "submit" }}
          width="285px"
          height="36px"
          text="Sign up"
          buttonState={signUpState}
          btnTestId="signUpBtn"
        />
        <p
          className="auth-help"
          style={emailErrMssg || passErrMssg || confPassErrMssg ? { marginTop: "8px" } : { marginTop: "12px" }}
        >
          Already have an account? <a className="auth-help-link" href="signin">Sign in</a>
        </p>
      </AuthContainer>
    </PageContainer>
  )
}