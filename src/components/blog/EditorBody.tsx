import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import styles from "./EditorBody.module.css"
import LineCounter from "./LineCounter"

type TextChange = { changeType: "Tab", changePos: number } | { changeType: "Other" }

export interface TextInfo {
  text: string,
  change: TextChange
}

interface EditorBodyProps {
  textInfo: TextInfo,
  setText: (textInfo: TextInfo) => void,
  title: string,
  containerStyleOverrides?: CSSProperties,
  testId?: string
}

// Returns the number of lines present in the given text
function countNumLines(text: string): number {
  return (text.match(/\n/g)?.length || 0) + 1
}

// Returns how many lines of the given textArea can fit in the given container
function getContainerSizeInLines(container: HTMLDivElement, lineHeight: number) {
  const containerHeight = parseInt(getComputedStyle(container).height)

  return Math.ceil(containerHeight / lineHeight)
}

function getVerticalExpansion(
  textArea: HTMLTextAreaElement,
  textAreaStyles: CSSStyleDeclaration,
  lineCount: number,
  container: HTMLDivElement
) {
  // Get the scroll height of the textarea component
  const scrollHeight = textArea.scrollHeight
  // Get the line height of the textarea component
  const lineHeight = parseInt(textAreaStyles.lineHeight)
  // Now calculate the maximum number of lines that can fit in the current textarea
  const maxLineCount = Math.ceil(scrollHeight / lineHeight)

  // If there are less lines remaining in the textArea than one full parent container space, then 
  // expand the textArea by one lineHeight
  // This will allow the user to always be able to scroll the bottom line they are typing 
  // to the top of the parent container
  if (maxLineCount - lineCount < getContainerSizeInLines(container, lineHeight)) {
    return scrollHeight + lineHeight
  }
  return 0
}

function getHorizontalExpansion(textArea: HTMLTextAreaElement, textAreaStyles: CSSStyleDeclaration) {
  if (textArea.scrollWidth > parseInt(textAreaStyles.width)) {
    return textArea.scrollWidth + parseInt(textAreaStyles.fontSize) * 2
  }
  return 0
}

export default function EditorBody({ textInfo, setText, title, containerStyleOverrides, testId }: EditorBodyProps) {
  const [numLines, setNumLines] = useState(1)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [textAreaDimensions, setTextAreaDimensions] = useState<CSSProperties>()

  useEffect(() => {
    if (textInfo.change.changeType === "Tab" && inputRef.current) {
      inputRef.current.selectionStart = textInfo.change.changePos
      inputRef.current.selectionEnd = textInfo.change.changePos
    }
  }, [textInfo, inputRef])

  useEffect(() => {
    // Get the new line count
    const updatedNumLines = countNumLines(textInfo.text)
    // Now update the line counter displayed
    setNumLines(updatedNumLines)

    // Check if textarea needs to be expanded
    if (inputRef.current && containerRef.current) {
      const inputRefStyles = getComputedStyle(inputRef.current)
      // Get the required textArea component vertical expansion if any
      const verticalExpansion = getVerticalExpansion(inputRef.current, inputRefStyles, updatedNumLines, containerRef.current)
      // Get the required textArea horizontal expansion if any
      const horizontalExpansion = getHorizontalExpansion(inputRef.current, inputRefStyles)

      if (verticalExpansion || horizontalExpansion) {
        const expansion: { minHeight?: string | number, minWidth?: string | number } = {}
        // Set current height and width if they exist
        if (textAreaDimensions) {
          expansion.minHeight = textAreaDimensions.minHeight
          expansion.minWidth = textAreaDimensions.minWidth
        }

        // Now override current height or width with the expanded amount if required
        if (verticalExpansion) expansion.minHeight = verticalExpansion
        if (horizontalExpansion) expansion.minWidth = horizontalExpansion

        setTextAreaDimensions(expansion)
      }
    }
  }, [textInfo.text, textAreaDimensions])

  // Create indentation when the Tab key is pressed
  const onTabDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      // Prevent tab key from removing focus from the textarea element
      e.preventDefault()
      // Now add indentation to the location of the cursor
      if (inputRef.current) {
        const start = inputRef.current.selectionStart
        const end = inputRef.current.selectionEnd

        const newText = textInfo.text.substring(0, start) + "\t" + textInfo.text.substring(end)
        setText({ text: newText, change: { changeType: "Tab", changePos: start + 1 } }) /* increment end by 1 to account for the addition of a tab character */
      }
    }
  }, [inputRef, textInfo, setText])

  return (
    <div className={styles.middleContainer} style={containerStyleOverrides} data-testid={testId}>
      <div className={styles.innerContainer} ref={containerRef}>
        <LineCounter count={numLines} editorTitle={title} />
        <textarea
          className={styles.inputField}
          ref={inputRef}
          value={textInfo.text}
          onChange={(e) => setText({ text: e.target.value, change: { changeType: "Other" } })}
          onKeyDown={onTabDown}
          style={textAreaDimensions}
          wrap="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}