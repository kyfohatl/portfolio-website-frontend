import styles from "./Tooltip.module.css"

interface TooltipProps {
  text: string,
  children: JSX.Element,
  direction?: "upwards" | "downwards",
  testId?: string
}

export default function Tooltip({ text, children, direction = "downwards", testId }: TooltipProps) {
  let className = styles.tooltipContainer + " "
  if (direction === "downwards") className += styles.downwards
  else className += styles.upwards

  return (
    <div className={className} data-text={text} data-testid={testId}>
      {children}
    </div>
  )
}