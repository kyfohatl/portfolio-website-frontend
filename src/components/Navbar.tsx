import { Link } from "react-router-dom"
import Button from "./Button"

import styles from "./Navbar.module.css"

export default function Navbar() {
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
        <li className={styles.buttonAuth}>
          <Link to="/signin" className={styles.authLink}>
            <Button text="Sign in" type={{ type: "submit" }} height="36px" width="64px" marginTop="0px" />
          </Link>
        </li>
      </div>
    </nav>
  )
}