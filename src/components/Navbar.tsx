import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Api from "../lib/api/Api"
import { hasData } from "../lib/api/auth.api"
import Button, { ButtonState } from "./Button"

import styles from "./Navbar.module.css"

export default function Navbar() {
  // Used for navigating with the react router
  const navigate = useNavigate()

  // Button disabled states
  const [signInDisabled, setSignInDisabled] = useState(false)
  const [signUpDisabled, setSignUpDisabled] = useState(false)
  // Button loading states
  const [signInState, setSignInState] = useState<ButtonState>({ state: "normal" })
  const [signUpState, setSignUpState] = useState<ButtonState>({ state: "normal" })
  const [signOutState, setSignOutState] = useState<ButtonState>({ state: "normal" })

  const onSigInClick = useCallback(() => {
    // Disable other buttons and set loading
    setSignUpDisabled(true)
    setSignInState({ state: "loading" })
  }, [])

  const onSignUpClick = useCallback(() => {
    // Disable other buttons and set loading
    setSignInDisabled(true)
    setSignUpState({ state: "loading" })
  }, [])

  const onSignOutClick = useCallback(async () => {
    // Set button loading state
    setSignOutState({ state: "loading" })

    // Sing out the user
    await Api.signOut()
    // Now navigate to the sign in page
    navigate("/signin")
  }, [navigate])

  return (
    <nav className={styles.navbar}>
      <div className={styles.nav}>
        <li key="logo" className={styles.logo}><Link to="/" className={styles.logoLink}>Ehsan's Portfolio</Link></li>
        <li key="techstack" className={styles.buttonNav}><Link to="/techstack" className={styles.navLink}>Techstack</Link></li>
        <li key="about" className={styles.buttonNav}><Link to="/about" className={styles.navLink}>About</Link></li>
        <li key="skills" className={styles.buttonNav}><Link to="/skills" className={styles.navLink}>Skills &amp; Qualifications</Link></li>
        <li key="examples" className={styles.buttonNav}><Link to="/examples" className={styles.navLink}>Examples of Work</Link></li>
        <li key="blogs" className={styles.buttonNav}><Link to="/viewblogs" className={styles.navLink}>Blogs</Link></li>
      </div>
      <div className={styles.auth}>
        {hasData()
          ?
          <li className={styles.buttonAuth}>
            <Button
              text="Sign out"
              type={{ type: "button", callBack: onSignOutClick }}
              height="36px"
              width="100px"
              marginTop="0px"
              backgroundColor="#253C78"
              buttonState={signOutState}
            />
          </li>
          : [
            <li className={styles.buttonAuth}>
              <Link to="/signin" className={styles.authLink}>
                <Button
                  text="Sign in"
                  type={{ type: "submit", callBack: onSigInClick }}
                  height="36px"
                  width="100px"
                  marginTop="0px"
                  disabled={signInDisabled}
                  buttonState={signInState}
                />
              </Link>
            </li>,
            <li className={styles.buttonAuth}>
              <Link to="/signup" className={styles.authLink}>
                <Button
                  text="Sign up"
                  type={{ type: "submit", callBack: onSignUpClick }}
                  height="36px"
                  width="100px"
                  marginTop="0px"
                  backgroundColor="#340068"
                  disabled={signUpDisabled}
                  buttonState={signUpState}
                />
              </Link>
            </li>
          ]
        }
      </div>
    </nav>
  )
}