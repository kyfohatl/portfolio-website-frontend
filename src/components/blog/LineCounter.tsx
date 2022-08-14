import styles from "./LineCounter.module.css"

interface LineCounterProps {
  count: number
}

export default function LineCounter({ count }: LineCounterProps) {
  const lines: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    lines.push(<div key={i} className={styles.line}>{i + 1}</div>)
  }

  return (
    <div className={styles.linesCol}>
      {lines}
    </div>
  )
}