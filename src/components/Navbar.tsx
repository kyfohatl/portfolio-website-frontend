import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Api from "../lib/api/Api"
import { hasTokens } from "../lib/api/auth.api"
import Button from "./Button"

import styles from "./Navbar.module.css"

export default function Navbar() {
  // Used for navigating with the react router
  const navigate = useNavigate()

  // Button disabled states
  const [signInDisabled, setSignInDisabled] = useState(false)
  const [signUpDisabled, setSignUpDisabled] = useState(false)
  // Button loading states
  const [signInLoading, setSignInLoading] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)

  const onSigInClick = useCallback(() => {
    // Disable other buttons and set loading
    setSignUpDisabled(true)
    setSignInLoading(true)
  }, [])

  const onSignUpClick = useCallback(() => {
    // Disable other buttons and set loading
    setSignInDisabled(true)
    setSignUpLoading(true)
  }, [])

  const onSignOutClick = useCallback(async () => {
    // Set button loading state
    setSignOutLoading(true)

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
      </div>
      <div className={styles.auth}>
        {hasTokens()
          ?
          <li className={styles.buttonAuth}>
            <Button
              text="Sign out"
              type={{ type: "button", callBack: onSignOutClick }}
              height="36px"
              width="80px"
              marginTop="0px"
              backgroundColor="#253C78"
              isLoading={signOutLoading}
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
                  isLoading={signInLoading}
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
                  isLoading={signUpLoading}
                />
              </Link>
            </li>
          ]
        }
      </div>
    </nav>
  )
}