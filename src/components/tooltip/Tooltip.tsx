import styles from "./Tooltip.module.css"

interface TooltipProps {
  text: string,
  children: JSX.Element,
  direction?: "upwards" | "downwards"
}

export default function Tooltip({ text, children, direction = "downwards" }: TooltipProps) {
  let className = styles.tooltipContainer + " "
  if (direction === "downwards") className += styles.downwards
  else className += styles.upwards

  return (
    <div className={className} data-text={text}>
      {children}
    </div>
  )
}