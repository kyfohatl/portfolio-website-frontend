import "./PageContainer.css"

import Navbar from "./Navbar"

interface PageContainerProps {
  backgroundStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentBlockStyle?: React.CSSProperties,
  children: React.ReactNode
}

export default function PageContainer({
  backgroundStyle = {},
  contentStyle = {},
  contentBlockStyle = {},
  children
}: PageContainerProps) {
  return (
    <div className="page-background" style={backgroundStyle}>
      <Navbar />
      <div className="content" style={contentStyle}>
        <div className="content-block" style={contentBlockStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}