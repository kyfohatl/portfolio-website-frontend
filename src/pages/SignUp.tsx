import "./SignUp.css"

import { useCallback, useState } from "react";
import AuthContainer from "../components/auth/AuthContainer";
import InputText from "../components/auth/InputText";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

interface ErrorResponse {
  error?: Record<string, string>
}

export default function SignUp() {
  // User inputs
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confPass, setConfPass] = useState("")
  // Error messages
  const [emailErrMssg, setEmailErrMssg] = useState("")
  const [passErrMssg, setPassErrMssg] = useState("")
  const [confPassErrMssg, setConfPassErrMssg] = useState("")

  const onSubmit = useCallback(async () => {
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
      } else {
        console.log("New user created: ", parsedResponse)
      }
    } catch (err) {
      console.error(err)
    }
  }, [email, pass, confPass])

  return (
    <PageContainer contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <AuthContainer title="Sign up">
        <InputText
          label="Email"
          text={email}
          setText={setEmail}
          errorText={emailErrMssg}
        />
        <InputText
          label="Password"
          text={pass}
          setText={setPass}
          errorText={passErrMssg}
        />
        <InputText
          label="Confirm Password"
          text={confPass}
          setText={setConfPass}
          errorText={confPassErrMssg}
        />
        <Button
          width="285px"
          height="36px"
          text="Sign up"
          callBack={onSubmit}
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