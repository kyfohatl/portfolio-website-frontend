import "./AuthContainer.css"

interface AuthContainerProps {
  title: string,
  children: React.ReactNode
}

export default function AuthContainer({ title, children }: AuthContainerProps) {
  return (
    <div className="auth-container">
      <h3 className="auth-container-title">{title}</h3>
      <div className="content">
        {children}
      </div>
    </div>
  )
}