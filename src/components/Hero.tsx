import Button from "./Button"
import styles from "./Hero.module.css"

import { ReactComponent as DownArrow } from "../assets/images/downwardPointer.svg"

interface HeroProps {
  onExploreClick: () => void
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className={styles.outerContainer}>
      <article className={styles.textContainer}>
        <h1>Ehsan's Blog</h1>
        <p>
          I created this website to further my web development learning and show off my skills!
          Click the "Explore" button to begin exploring this site!
        </p>
      </article>
      <div className={styles.buttonContainer}>
        <Button
          text="Explore"
          type={{ type: "button", callBack: onExploreClick }}
          backgroundColor="black"
          color="white"
          width="118px"
          height="40px"
        />
        <DownArrow width="26px" height="26px" className={styles.arrow} />
        {/* <svg viewBox="0 0 18 18" fill="none" className={styles.arrow}>
          <circle cx="9" cy="9" r="9" fill="black" />
          <path d="M8.64645 15.3536C8.84171 15.5488 9.15829 15.5488 9.35355 15.3536L12.5355 12.1716C12.7308 11.9763 12.7308 11.6597 12.5355 11.4645C12.3403 11.2692 12.0237 11.2692 11.8284 11.4645L9 14.2929L6.17157 11.4645C5.97631 11.2692 5.65973 11.2692 5.46447 11.4645C5.2692 11.6597 5.2692 11.9763 5.46447 12.1716L8.64645 15.3536ZM8.5 3V15H9.5V3H8.5Z" fill="white" />
        </svg> */}
      </div>
    </div>
  )
}