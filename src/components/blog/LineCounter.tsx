import styles from "./LineCounter.module.css"

interface LineCounterProps {
  count: number,
  editorTitle?: string
}

export default function LineCounter({ count, editorTitle }: LineCounterProps) {
  const lines: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    lines.push(<div key={i} className={styles.line}>{i + 1}</div>)
  }

  return (
    <div className={styles.linesCol} data-testid={`${editorTitle}LineCounter`}>
      {lines}
    </div>
  )
}