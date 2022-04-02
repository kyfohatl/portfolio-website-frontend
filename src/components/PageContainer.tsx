import "./PageContainer.css"

import Navbar from "./Navbar"

interface PageContainerProps {
  backgroundStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentBlockStyle?: React.CSSProperties,
  children: React.ReactNode
}

export default function PageContainer({
  backgroundStyle,
  contentStyle,
  contentBlockStyle,
  children
}: PageContainerProps) {
  // Assign given style or give default style if none is provided for part
  const background: Record<string, any> = {}
  const content: Record<string, any> = {}
  const contentBlock: Record<string, any> = {}
  if (backgroundStyle) {
    background.style = backgroundStyle
  } else {
    background.className = "page-background"
  }
  if (contentStyle) {
    content.style = contentStyle
  } else {
    content.className = "content"
  }
  if (contentBlockStyle) {
    contentBlock.style = contentBlockStyle
  } else {
    contentBlock.className = "content-block"
  }

  return (
    <div {...background}>
      <Navbar />
      <div {...content}>
        <div {...contentBlock}>
          {children}
        </div>
      </div>
    </div>
  )
}