import styles from "./Error.module.css"

interface ErrorProps {
  code: string
}

export function getErrorMessage(code: string) {
  switch (code) {
    case "500":
      return "Oops! Something went wrong!"
    case "404":
      return "Page not found"
    case "403":
      return "You do not have permission to access this content"
    case "401":
      return "Please sign in"
    case "400":
      return "Bad request"
    default:
      return "Something went wrong..."
  }
}

export default function Error({ code }: ErrorProps) {
  const message = getErrorMessage(code)

  return (
    <div className={styles.container} data-testid="errorContainer">
      <h2>Error  {code}</h2>
      <h4 className={styles.message}>{message}</h4>
      <svg data-testid="errorImage" viewBox="0 0 478 291" fill="none">
        <rect x="2" y="2" width="474" height="287" fill="white" stroke="black" strokeWidth="4" />
        <rect x="2" y="2" width="474" height="31" fill="#C4C4C4" stroke="black" strokeWidth="4" />
        <rect x="443" y="2" width="33" height="31" fill="#FE834D" stroke="black" strokeWidth="4" />
        <circle cx="238.5" cy="156.5" r="82.5" fill="#FE834D" />
        <path d="M290 207.5C290 200.737 288.668 194.04 286.08 187.792C283.492 181.544 279.698 175.866 274.916 171.084C270.134 166.302 264.456 162.508 258.208 159.92C251.96 157.332 245.263 156 238.5 156C231.737 156 225.04 157.332 218.792 159.92C212.544 162.508 206.866 166.302 202.084 171.084C197.302 175.866 193.508 181.544 190.92 187.792C188.332 194.04 187 200.737 187 207.5L197.3 207.5C197.3 202.09 198.366 196.732 200.436 191.733C202.507 186.735 205.541 182.193 209.367 178.367C213.193 174.541 217.735 171.507 222.733 169.436C227.732 167.366 233.09 166.3 238.5 166.3C243.91 166.3 249.268 167.366 254.267 169.436C259.265 171.507 263.807 174.541 267.633 178.367C271.459 182.193 274.493 186.735 276.564 191.733C278.634 196.732 279.7 202.09 279.7 207.5H290Z" fill="white" />
        <rect x="187" y="131.284" width="40" height="10" transform="rotate(-45 187 131.284)" fill="white" />
        <rect x="254" y="131.284" width="40" height="10" transform="rotate(-45 254 131.284)" fill="white" />
        <rect x="194.749" y="103.678" width="40" height="10" transform="rotate(45 194.749 103.678)" fill="white" />
        <rect x="261.749" y="103.678" width="40" height="10" transform="rotate(45 261.749 103.678)" fill="white" />
        <rect x="449" y="9.53552" width="5" height="26" transform="rotate(-45 449 9.53552)" fill="white" />
        <rect x="467.385" y="6" width="5" height="26" transform="rotate(45 467.385 6)" fill="white" />
      </svg>
    </div>
  )
}