import Button from "./Button"
import styles from "./Hero.module.css"

import { ReactComponent as DownArrow } from "../assets/images/downwardPointer.svg"

export default function Hero() {
  return (
    <div className={styles.outerContainer}>
      <article className={styles.textContainer}>
        <h1>Ehsan's Blog</h1>
        <p>I created this website to further my web development learning and show off my skills!</p>
      </article>
      <div className={styles.buttonContainer}>
        <Button
          text="Explore"
          type={{ type: "button", callBack: () => { console.log("test") } }}
          backgroundColor="black"
          color="white"
          width="118px"
          height="40px"
        />
        <DownArrow width="26px" height="26px" />
      </div>
    </div>
  )
}