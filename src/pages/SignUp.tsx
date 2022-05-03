import "./SignUp.css"

import React, { useCallback, useState } from "react"
import AuthContainer from "../components/auth/AuthContainer"
import InputText from "../components/auth/InputText"
import Button, { ButtonState } from "../components/Button"
import PageContainer from "../components/PageContainer"
import { ErrorResponse } from "../lib/commonTypes"
import { useNavigate } from "react-router-dom"

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

  const navigate = useNavigate()

  const onSubmit = useCallback(async (event: React.FormEvent) => {
    // Prevent default form behavior
    event.preventDefault()

    // Check for input errors
    if (!email) {
      setEmailErrMssg("A valid email is required!")
      return
    } else {
      setEmailErrMssg("")
    }
    if (!pass) {
      setPassErrMssg("A valid password is required!")
      return
    } else {
      setPassErrMssg("")
    }
    if (pass !== confPass) {
      setConfPassErrMssg("Passwords must match!")
      return
    } else {
      setConfPassErrMssg("")
    }

    // No input errors detected
    // Set button to loading state
    setSignUpState({ state: "loading" })

    try {
      // Post new user
      const response = await fetch("http://localhost:8000/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password: pass
        })
      })

      const parsedResponse = await response.json() as ErrorResponse
      if (parsedResponse.error?.email) {
        // Set the new error message
        setEmailErrMssg(parsedResponse.error.email)
        // Set button back to normal state
        setSignUpState({ state: "normal" })
      } else {
        // New user was created
        console.log("New user created: ", parsedResponse)
        // TODO
        // Navigate to home page
        navigate("/")
      }
    } catch (err) {
      // TODO
      console.error(err)
    }
  }, [email, pass, confPass, navigate])

  return (
    <PageContainer
      contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      contentBlockStyle={{ display: "flex", justifyContent: "center" }}
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