import React, { CSSProperties } from "react"
import "./AuthContainer.css"

interface AuthContainerProps {
  title: string,
  onSubmit: (event: React.FormEvent) => void,
  children: React.ReactNode,
  width?: string,
  height?: string
}

export default function AuthContainer({ title, onSubmit, children, width, height }: AuthContainerProps) {
  const styles: CSSProperties = {}
  if (width) styles.width = width
  if (height) styles.height = height

  return (
    <div className="auth-container" style={styles}>
      <h3 className="auth-container-title">{title}</h3>
      <form className="content" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  )
}