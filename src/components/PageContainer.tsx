import "./PageContainer.css"

import Navbar from "./Navbar"

interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="page-background">
      <Navbar />
      <div className="content">
        <div className="content-block">
          {children}
        </div>
      </div>
    </div>
  )
}