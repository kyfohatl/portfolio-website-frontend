import Button from "../../Button"

import { ReactComponent as MenuIcon } from "../../../assets/images/menuIcon.svg"
import { ReactComponent as CloseIcon } from "../../../assets/images/helpDisplay/closeIcon.svg"

import styles from "./NavLinksMobile.module.css"
import MobileNavLink from "./MobileNavLink"
import routes from "../../../resources/routes/routes"
import React, { useCallback, useState } from "react"
import { hasData } from "../../../lib/api/helpers/auth/redirectAndClearData"
import Api from "../../../lib/api/Api"

interface NavLinksMobileProps {
  navbarHeight: string,
  refs?: { menuBtnRef: React.ForwardedRef<HTMLButtonElement> }
}

export default function NavLinksMobile({ navbarHeight, refs }: NavLinksMobileProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownClasses, setDropdownClasses] = useState(styles.dropDown)
  const [btnDisabled, setBtnDisabled] = useState(false)

  const [signOutLinkIsLoading, setSignOutLinkIsLoading] = useState(false)

  const onMenuClick = useCallback(() => {
    // Disabled the menu button
    setBtnDisabled(true)
    // Ensure that the menu is showing so that the opening/closing animation can be displayed
    setShowDropdown(true)
    // Switch the menu open/close state
    setDropdownOpen(open => {
      // If the menu is open, add closing animation
      if (open) setDropdownClasses(`${styles.dropDown} ${styles.close}`)

      return !open
    })
  }, [])

  const onDropdownAnimEnd = useCallback(() => {
    // Re-enable the menu button
    setBtnDisabled(false)

    // If we are closing the dropdown, do not show it, and remove the closing animation
    if (!dropdownOpen) {
      setShowDropdown(false)
      setDropdownClasses(styles.dropDown)
    }
  }, [dropdownOpen])

  const onSignOutClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setSignOutLinkIsLoading(true)

    // Sign out the user and redirect to the sign in page
    await Api.signOut()
  }, [])

  return (
    <div className={styles.container}>
      <Button
        type={{ type: "button", callBack: onMenuClick }}
        icon={dropdownOpen
          ? <CloseIcon height="36px" width="36px" stroke="black" data-testid="navbarMobile_closeIcon" />
          : <MenuIcon height="36px" width="36px" data-testid="navbarMobile_menuIcon" />
        }
        height="40px"
        width="40px"
        backgroundColor="transparent"
        boxShadow="0 0 0 0"
        disabled={btnDisabled}
        btnTestId="navbarMobileMenuBtn"
        {...(refs?.menuBtnRef ? { ref: refs.menuBtnRef } : {})}
      />
      {showDropdown &&
        <ul
          className={dropdownClasses}
          style={{ "--navbarHeight": navbarHeight } as React.CSSProperties}
          onAnimationEnd={onDropdownAnimEnd}
          data-testid="navbarMobile_dropdown"
        >
          {hasData()
            ? <MobileNavLink
              text="Sign Out"
              linkPath={routes.home}
              onClick={onSignOutClick}
              isLoading={signOutLinkIsLoading}
              key={1}
            />
            : [
              <MobileNavLink key={2} text="Sign In" linkPath={routes.signIn} />,
              <MobileNavLink key={3} text="Sign Up" linkPath={routes.signUp} />
            ]
          }

          <MobileNavLink key={4} text="Skills & Qualifications" linkPath={routes.skills} />
          <MobileNavLink key={5} text="Examples of Work" linkPath={routes.examples} />
          <MobileNavLink key={6} text="Blogs" linkPath={routes.viewBlogs} />
          <MobileNavLink key={7} text="Create a New Blog" linkPath={routes.editBlog} />
        </ul>
      }
    </div>
  )
}