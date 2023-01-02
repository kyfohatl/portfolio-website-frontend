import { forwardRef, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import routes from "../../resources/routes/routes"
import NavLinksDesktop from "./desktop/NavLinksDesktop"
import NavLinksMobile from "./mobile/NavLinksMobile"

import styles from "./Navbar.module.css"

const Navbar = forwardRef<HTMLLIElement>((_, ref) => {
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
      <NavLinksDesktop refs={{ sigInRef: ref }} />
      <NavLinksMobile navbarHeight={navbarHeight} />
    </nav>
  )
})

export default Navbar