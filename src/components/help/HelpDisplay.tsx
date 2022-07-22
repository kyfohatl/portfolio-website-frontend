import React, { useCallback, useMemo, useState } from "react"
import styles from "./HelpDisplay.module.css"
import HelpDisplaySideButton from "./HelpDisplaySideButton"

interface HelpDisplayProps {
  cards?: JSX.Element
}

const OVERRIDE_STYLES: React.CSSProperties = {
  display: "none"
}

export default function HelpDisplay({ cards }: HelpDisplayProps) {
  const [div1Override, setDiv1Override] = useState<React.CSSProperties>({})

  const func = useCallback(() => {
    console.log("NAHAHA")
    setDiv1Override({ display: "none" })
  }, [])

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.displayContainer}>
        <HelpDisplaySideButton direction="left" callBack={func} />
        <div className={styles.div1} style={div1Override}></div>
        <div className={styles.div2}></div>
        <div className={styles.div3}></div>
        <HelpDisplaySideButton direction="right" callBack={() => { }} />
      </div>
    </>
  )
}