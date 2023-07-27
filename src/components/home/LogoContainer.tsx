import styles from "./LogoContainer.module.css"

interface LogoContainerProps {
  children: React.ReactNode
}

export default function LogoContainer({ children }: LogoContainerProps) {
  return (
    <div className={styles.logoContainer}>
      {children}
    </div>
  )
}