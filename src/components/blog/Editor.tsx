import React, { CSSProperties, useCallback, useRef, useState } from "react"
import styles from "./Editor.module.css"
import LineCounter from "./LineCounter"


export default function Editor() {
  const [text, setText] = useState("")
  const [numLines, setNumLines] = useState(1)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [textAreaHeight, setTextAreaHeight] = useState<CSSProperties>()

  const onTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the text state
    setText(e.target.value)
    // Now update the line counter displayed
    if (inputRef.current) {
      // Get the scroll height of the textarea component
      const scrollHeight = inputRef.current.scrollHeight
      // Get the line height of the textarea component
      const inputRefStyles = getComputedStyle(inputRef.current)
      const lineHeight = parseInt(inputRefStyles.lineHeight)
      // Now calculate the number of lines needed
      setNumLines(Math.ceil(scrollHeight / lineHeight))

      // If we need more space, scale the textarea component
      const actualHeight = Math.ceil(parseInt(inputRefStyles.height))
      if (scrollHeight > actualHeight) {
        setTextAreaHeight({ height: scrollHeight * 2 })
      }
    }
  }, [inputRef])

  return (
    <div className={styles.container}>
      <LineCounter count={numLines} />
      <textarea className={styles.inputField} ref={inputRef} value={text} onChange={onTextChange} style={textAreaHeight} />
    </div>
  )
}