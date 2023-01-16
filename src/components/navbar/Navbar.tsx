import { forwardRef, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import routes from "../../resources/routes/routes"
import NavLinksDesktop from "./desktop/NavLinksDesktop"
import NavLinksMobile from "./mobile/NavLinksMobile"

import styles from "./Navbar.module.css"

export type NavbarComponentRefs = {
  loginBtn?: React.RefObject<HTMLLIElement>,
  menuBtn?: React.RefObject<HTMLButtonElement>
}

interface NavbarProps {
  componentRefs?: NavbarComponentRefs
}

const Navbar = forwardRef<HTMLLIElement, NavbarProps>(({ componentRefs }, ref) => {
  const [navbarHeight, setNavBarHeight] = useState("0px")
  const navbarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!navbarRef.current) return
    setNavBarHeight(getComputedStyle(navbarRef.current).height)
  }, [])

  return (
    <nav ref={navbarRef} className={styles.navbar}>
      <Link to={routes.home} className={styles.logoLink} data-testid="homeNavLink">
        Ehsan's Blog
      </Link>
      <NavLinksDesktop {...(componentRefs?.loginBtn ? { refs: { sigInRef: componentRefs.loginBtn } } : {})} />
      <NavLinksMobile
        navbarHeight={navbarHeight}
        {...(componentRefs?.menuBtn ? { refs: { menuBtnRef: componentRefs.menuBtn } } : {})}
      />
    </nav>
  )
})

export default Navbar