import "./SignUp.css"

import { useState } from "react";
import AuthContainer from "../components/auth/AuthContainer";
import InputText from "../components/auth/InputText";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

export default function SignUp() {
  const signUpButtonStyles: React.CSSProperties = {
    fontSize: "14px",
    backgroundColor: "darkred",
    color: "white",
    width: "285px",
    height: "36px",
    marginTop: "10px"
  }

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confPass, setConfPass] = useState("")

  function onSubmit(email: string, pass: string, confPass: string) {
    if (pass !== confPass) {
      console.log("Passwords do not match!")
    } else {
      console.log(email, pass, confPass)
    }
  }

  return (
    <PageContainer contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <AuthContainer title="Sign up">
        <InputText label="Email" state={email} setState={setEmail} />
        <InputText label="Password" state={pass} setState={setPass} />
        <InputText label="Confirm Password" state={confPass} setState={setConfPass} />
        <Button
          styles={signUpButtonStyles}
          text="Sign up"
          callBack={onSubmit}
          callBackArgs={[email, pass, confPass]}
        />
        <p className="auth-help">Already have an account? <a className="auth-help-link" href="signin">Sign in</a></p>
      </AuthContainer>
    </PageContainer>
  )
}