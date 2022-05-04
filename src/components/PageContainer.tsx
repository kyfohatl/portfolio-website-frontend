import "./PageContainer.css"

import Navbar from "./Navbar"
import Loading from "./Loading"

interface PageContainerProps {
  backgroundStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentBlockStyle?: React.CSSProperties,
  loading?: boolean,
  children: React.ReactNode
}

export default function PageContainer({
  backgroundStyle = {},
  contentStyle = {},
  contentBlockStyle = {},
  loading = false,
  children
}: PageContainerProps) {
  if (loading) {
    contentStyle = { alignItems: "center" }
    contentBlockStyle = { maxHeight: "15%", maxWidth: "15%" }
  }

  return (
    <div className="page-background" style={backgroundStyle}>
      {!loading && <Navbar />}
      <div className="content" style={contentStyle}>
        <div className="content-block" style={contentBlockStyle}>
          {loading ? <Loading /> : children}
        </div>
      </div>
    </div>
  )
}