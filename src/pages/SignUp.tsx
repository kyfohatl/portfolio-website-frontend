import "./SignUp.css"

import { useCallback, useState } from "react";
import AuthContainer from "../components/auth/AuthContainer";
import InputText from "../components/auth/InputText";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confPass, setConfPass] = useState("")
  const [emailErr, setEmailErr] = useState(false)
  const [passErr, setPassErr] = useState(false)
  const [confPassErr, setConfPassErr] = useState(false)

  const onSubmit = useCallback(async () => {
    // Check for input errors
    if (!email) {
      setEmailErr(true)
      return
    } else {
      setEmailErr(false)
    }
    if (!pass) {
      setPassErr(true)
      return
    } else {
      setPassErr(false)
    }
    if (pass !== confPass) {
      setConfPassErr(true)
      return
    } else {
      setConfPassErr(false)
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

      console.log("New user created: ", response.body)
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
          error={emailErr}
          errorText="A valid email is required!"
        />
        <InputText
          label="Password"
          text={pass}
          setText={setPass}
          error={passErr}
          errorText="A valid password is required!"
        />
        <InputText
          label="Confirm Password"
          text={confPass}
          setText={setConfPass}
          error={confPassErr}
          errorText="Passwords must match!"
        />
        <Button
          width="285px"
          height="36px"
          text="Sign up"
          callBack={onSubmit}
        />
        <p className="auth-help" style={emailErr || passErr || confPassErr ? { marginTop: "8px" } : { marginTop: "12px" }}>
          Already have an account? <a className="auth-help-link" href="signin">Sign in</a>
        </p>
      </AuthContainer>
    </PageContainer>
  )
}