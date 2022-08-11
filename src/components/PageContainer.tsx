import "./PageContainer.css"

import Navbar from "./Navbar"
import Loading from "./Loading"
import Error from "./Error"

export type PageContainerState = { status: "normal" | "loading" } | { status: "Error", errorCode: string }

interface PageContainerProps {
  backgroundStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentBlockStyle?: React.CSSProperties,
  state?: PageContainerState,
  children: React.ReactNode,
  contentTestId?: string
}

export default function PageContainer({
  backgroundStyle = {},
  contentStyle = {},
  contentBlockStyle = {},
  state = { status: "normal" },
  children,
  contentTestId
}: PageContainerProps) {
  if (state.status === "loading") {
    contentStyle = { alignItems: "center" }
    contentBlockStyle = { maxHeight: "15%", maxWidth: "15%" }
  } else if (state.status === "Error") {
    contentStyle = { alignItems: "center" }
    contentBlockStyle = { maxHeight: "40%", maxWidth: "40%" }
  }

  return (
    <div className="page-background" style={backgroundStyle}>
      {state.status !== "loading" && <Navbar />}
      <div className="content" style={contentStyle} data-testid={contentTestId}>
        <div className="content-block" style={contentBlockStyle}>
          {
            state.status === "loading" ? <Loading />
              : state.status === "Error" ? <Error code={state.errorCode} />
                : children
          }
        </div>
      </div>
    </div>
  )
}