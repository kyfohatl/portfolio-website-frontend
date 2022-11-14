import Button from "./Button"
import styles from "./Hero.module.css"

import { ReactComponent as DownArrow } from "../assets/images/downwardPointer.svg"
import Tooltip from "./tooltip/Tooltip"

interface HeroProps {
  onExploreClick: () => void
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className={styles.outerContainer} data-testid="heroOuterContainer">
      <article className={styles.textContainer}>
        <h1>Ehsan's Blog</h1>
        <p>
          I created this website to further my web development learning and show off my skills!
          Click the "Explore" button and keep scrolling to take a tour of this website's most
          important features!
        </p>
      </article>
      <div className={styles.buttonContainer}>
        <Tooltip text="Click to start the tour!" direction="upwards">
          <Button
            text="Explore"
            type={{ type: "button", callBack: onExploreClick }}
            backgroundColor="black"
            color="white"
            width="118px"
            height="40px"
            btnTestId="exploreBtn"
          />
        </Tooltip>
        <DownArrow width="26px" height="26px" className={styles.arrow} />
      </div>
    </div>
  )
}