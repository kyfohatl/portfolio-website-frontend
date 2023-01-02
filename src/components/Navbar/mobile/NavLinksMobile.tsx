import Button from "../../Button"

import { ReactComponent as MenuIcon } from "../../../assets/images/menuIcon.svg"
import { ReactComponent as CloseIcon } from "../../../assets/images/helpDisplay/closeIcon.svg"

import styles from "./NavLinksMobile.module.css"
import MobileNavLink from "./MobileNavLink"
import routes from "../../../resources/routes/routes"
import React, { useCallback, useState } from "react"

interface NavLinksMobileProps {
  navbarHeight: string
}

export default function NavLinksMobile({ navbarHeight }: NavLinksMobileProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownClasses, setDropdownClasses] = useState(styles.dropDown)
  const [btnDisabled, setBtnDisabled] = useState(false)

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

  return (
    <div className={styles.container}>
      <Button
        type={{ type: "button", callBack: onMenuClick }}
        icon={dropdownOpen
          ? <CloseIcon height="36px" width="36px" stroke="black" />
          : <MenuIcon height="36px" width="36px" />
        }
        height="40px"
        width="40px"
        backgroundColor="transparent"
        boxShadow="0 0 0 0"
        disabled={btnDisabled}
      />
      {showDropdown &&
        <ul
          className={dropdownClasses}
          style={{ "--navbarHeight": navbarHeight } as React.CSSProperties}
          onAnimationEnd={onDropdownAnimEnd}
        >
          <MobileNavLink text="Sign In" linkPath={routes.signIn} />
          <MobileNavLink text="Sign Up" linkPath={routes.signUp} />
          <MobileNavLink text="Skills & Qualifications" linkPath={routes.skills} />
          <MobileNavLink text="Examples of Work" linkPath={routes.examples} />
          <MobileNavLink text="Blogs" linkPath={routes.viewBlogs} />
          <MobileNavLink text="Create a New Blog" linkPath={routes.editBlog} />
        </ul>
      }
    </div>
  )
}