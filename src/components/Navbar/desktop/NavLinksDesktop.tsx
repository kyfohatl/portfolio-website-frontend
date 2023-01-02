import styles from "./NavLinksDesktop.module.css"
import { hasData } from "../../../lib/api/helpers/auth/redirectAndClearData";
import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../../resources/routes/routes";
import Button, { ButtonState } from "../../Button";
import Api from "../../../lib/api/Api";

interface NavLinksDesktopProps {
  refs: { sigInRef: React.ForwardedRef<HTMLLIElement> }
}

export default function NavLinksDesktop({ refs }: NavLinksDesktopProps) {
  // Button disabled states
  const [signInDisabled, setSignInDisabled] = useState(false)
  const [signUpDisabled, setSignUpDisabled] = useState(false)
  // Button loading states
  const [signInState, setSignInState] = useState<ButtonState>({ state: "normal" })
  const [signUpState, setSignUpState] = useState<ButtonState>({ state: "normal" })
  const [signOutState, setSignOutState] = useState<ButtonState>({ state: "normal" })

  // Used for navigating with the react router
  const location = useLocation()
  const navigate = useNavigate()

  const onSignOutClick = useCallback(async () => {
    // Set button loading state
    setSignOutState({ state: "loading" })

    // Sing out the user
    await Api.signOut()
    // Now navigate to the sign in page
    navigate(routes.signIn)
  }, [navigate])

  const onSigInClick = useCallback(() => {
    // If we are already on the sign in page, do nothing
    if (location.pathname === routes.signIn) return

    // Disable other buttons and set loading
    setSignUpDisabled(true)
    setSignInState({ state: "loading" })
  }, [location.pathname])

  const onSignUpClick = useCallback(() => {
    // If we are already on the sign up page, do nothing
    if (location.pathname === routes.signUp) return

    // Disable other buttons and set loading
    setSignInDisabled(true)
    setSignUpState({ state: "loading" })
  }, [location.pathname])

  return (
    <div className={styles.desktopNav}>
      <div className={styles.nav}>
        <li key="skills" className={styles.buttonNav}>
          <Link to={routes.skills} className={styles.navLink} data-testid="skillsNavLink">
            Skills &amp; Qualifications
          </Link>
        </li>
        <li key="examples" className={styles.buttonNav}>
          <Link to={routes.examples} className={styles.navLink} data-testid="examplesNavLink">
            Examples of Work
          </Link>
        </li>
        <li key="viewBlogs" className={styles.buttonNav}>
          <Link to={routes.viewBlogs} className={styles.navLink} data-testid="viewBlogsNavLink">
            Blogs
          </Link>
        </li>
        <li key="editBlogs" className={styles.buttonNav}>
          <Link to={routes.editBlog} className={styles.navLink} data-testid="editBlogNavLink">
            Create A New Blog
          </Link>
        </li>
      </div>
      <div className={styles.auth}>
        {hasData()
          ?
          <li className={styles.buttonAuth} key="singOutBtn">
            <Button
              text="Sign out"
              type={{ type: "button", callBack: onSignOutClick }}
              height="36px"
              width="100px"
              marginTop="0px"
              backgroundColor="#253C78"
              buttonState={signOutState}
              btnTestId="navbarSignOut"
            />
          </li>
          : [
            <li ref={refs.sigInRef} className={styles.buttonAuth} key="signInBtn">
              <Link to={routes.signIn} className={styles.authLink}>
                <Button
                  text="Sign in"
                  type={{ type: "submit", callBack: onSigInClick }}
                  height="36px"
                  width="100px"
                  marginTop="0px"
                  disabled={signInDisabled}
                  buttonState={signInState}
                  btnTestId="navbarSignInBtn"
                />
              </Link>
            </li>,
            <li className={styles.buttonAuth} key="signUpBtn">
              <Link to={routes.signUp} className={styles.authLink}>
                <Button
                  text="Sign up"
                  type={{ type: "submit", callBack: onSignUpClick }}
                  height="36px"
                  width="100px"
                  marginTop="0px"
                  backgroundColor="#340068"
                  disabled={signUpDisabled}
                  buttonState={signUpState}
                  btnTestId="navbarSignUpBtn"
                />
              </Link>
            </li>
          ]
        }
      </div>
    </div>
  )
}