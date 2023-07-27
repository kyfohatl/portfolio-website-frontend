import { Link } from "react-router-dom"

import { ReactComponent as Arrow } from "../../../assets/images/helpDisplay/chevronRight.svg"

import styles from "./MobileNavLink.module.css"

interface MobileNavLinkProps {
  text: string,
  linkPath: string,
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => Promise<void>,
  isLoading?: boolean
}

export default function MobileNavLink({ text, linkPath, onClick, isLoading = false }: MobileNavLinkProps) {
  return (
    <li data-testid={"mobileNavLink_" + text}>
      <Link to={linkPath} className={styles.link} onClick={onClick}>
        <div className={styles.container}>
          {text}
          {isLoading
            ? <div className={styles.spinner} data-testid={"navLinkLoadingSpinner_" + text}></div>
            : <Arrow height="20px" width="20px" fill="white" data-testid={"navLinkArrow_" + text} />
          }
        </div>
      </Link>
    </li>
  )
}