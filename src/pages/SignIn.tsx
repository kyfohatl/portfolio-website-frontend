import "./SignIn.module.css"

import React, { useCallback, useState } from "react"
import AuthContainer from "../components/auth/AuthContainer"
import InputText from "../components/auth/InputText"
import Button from "../components/Button"
import PageContainer from "../components/PageContainer"
import { ApiResponse } from "../lib/commonTypes"

import { ReactComponent as FacebookLogo } from "../assets/images/facebookIcon.svg"
import { ReactComponent as GoogleLogo } from "../assets/images/googleIcon.svg"

export default function SignIn() {
  // User inputs
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  // Error messages
  const [emailErrMssg, setEmailErrMssg] = useState("")
  const [passErrMssg, setPassErrMssg] = useState("")

  const onSignIn = useCallback(async (event: React.FormEvent) => {
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

    // No input errors detected
    try {
      // Post new user
      const response = await fetch("http://localhost:8000/auth/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password: pass
        })
      })

      const parsedResponse = await response.json() as ApiResponse

      if ("error" in parsedResponse) {
        // An error has returned, respond accordingly
        if (parsedResponse.error.email) setEmailErrMssg(parsedResponse.error.email)
        if (parsedResponse.error.password) setPassErrMssg(parsedResponse.error.password)
        if (parsedResponse.error.generic) console.error(parsedResponse.error)
      } else {
        // The request succeeded
        // Store the access and refresh tokens in localStorage
        localStorage.setItem("accessToken", parsedResponse.success.accessToken)
        localStorage.setItem("refreshToken", parsedResponse.success.refreshToken)
      }
    } catch (err) {
      console.error(err)
    }
  }, [email, pass])

  const onSignInGoogle = useCallback(() => console.log("Google Sign in!"), [])

  const onSignInFacebook = useCallback(() => console.log("Facebook Sign in!"), [])

  return (
    <PageContainer contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <AuthContainer title="Sign In" onSubmit={onSignIn}>
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
        <Button
          type={{ type: "submit" }}
          width="285px"
          height="36px"
          text="Sign in"
        />
        <Button
          type={{ type: "button", callBack: onSignInGoogle }}
          width="285px"
          height="36px"
          text="Sign in with Google"
          backgroundColor="#FFFFFF"
          color="#000000"
          icon={<GoogleLogo width={28} height={28} />}
        />
        <Button
          type={{ type: "button", callBack: onSignInFacebook }}
          width="285px"
          height="36px"
          text="Sign in with Facebook"
          backgroundColor="#4267B2"
          icon={<FacebookLogo width={28} height={28} />}
        />
        <p
          className="auth-help"
          style={emailErrMssg || passErrMssg ? { marginTop: "8px" } : { marginTop: "12px" }}
        >
          Don't have an account? Create one <a className="auth-help-link" href="signup">here</a>
        </p>
      </AuthContainer>
    </PageContainer>
  )
}