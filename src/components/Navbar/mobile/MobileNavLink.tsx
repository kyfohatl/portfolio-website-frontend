import { Link } from "react-router-dom"

import { ReactComponent as Arrow } from "../../../assets/images/helpDisplay/chevronRight.svg"

import styles from "./MobileNavLink.module.css"

interface MobileNavLinkProps {
  text: string,
  linkPath: string
}

export default function MobileNavLink({ text, linkPath }: MobileNavLinkProps) {
  return (
    <li>
      <Link to={linkPath} className={styles.link}>
        <div className={styles.container}>
          {text}
          <Arrow height="20px" width="20px" fill="white" />
        </div>
      </Link>
    </li>
  )
}