import React from "react"
import "./AuthContainer.css"

interface AuthContainerProps {
  title: string,
  onSubmit: (event: React.FormEvent) => void,
  children: React.ReactNode
}

export default function AuthContainer({ title, onSubmit, children }: AuthContainerProps) {
  return (
    <div className="auth-container">
      <h3 className="auth-container-title">{title}</h3>
      <div className="content">
        <form onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  )
}