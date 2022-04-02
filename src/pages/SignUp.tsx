import AuthContainer from "../components/auth/AuthContainer";
import InputText from "../components/auth/InputText";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

export default function SignUp() {
  const signUpButtonStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
    backgroundColor: "darkred",
    color: "white",
    borderRadius: "10px",
    width: "285px",
    height: "36px",
    marginTop: "10px",
    borderStyle: "none"
  }

  return (
    <PageContainer contentStyle={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <AuthContainer title="Sign up">
        <InputText label="Email" />
        <InputText label="Password" />
        <InputText label="Confirm Password" />
        <Button styles={signUpButtonStyles} text="Sign up" />
      </AuthContainer>
    </PageContainer>
  )
}