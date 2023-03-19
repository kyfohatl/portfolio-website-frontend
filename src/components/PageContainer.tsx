import "./PageContainer.css"

import Navbar, { NavbarComponentRefs } from "./navbar/Navbar"
import Loading from "./Loading"
import Error from "./Error"
import React, { useEffect, useState } from "react"
import setPageTitle from "../lib/helpers/setPageTitle"

export type PageContainerState = { status: "normal" | "loading" } | { status: "Error", errorCode: string }
type PageContainerStyles = { desktop: React.CSSProperties, mobile: React.CSSProperties }

interface PageContainerProps {
  title: string,
  backgroundStyle?: PageContainerStyles,
  contentStyle?: PageContainerStyles,
  contentBlockStyle?: PageContainerStyles,
  state?: PageContainerState,
  children: React.ReactNode,
  contentTestId?: string,
  navbarRefs?: NavbarComponentRefs
}

const mql = window.matchMedia("(max-width: 1100px)")

export default function PageContainer({
  title,
  backgroundStyle = { desktop: {}, mobile: {} },
  contentStyle = { desktop: {}, mobile: {} },
  contentBlockStyle = { desktop: {}, mobile: {} },
  state = { status: "normal" },
  children,
  contentTestId,
  navbarRefs
}: PageContainerProps) {
  const [bckgStyleOverrides, setBckgStyleOverrides] = useState<React.CSSProperties>({})
  const [contentStyleOverrides, setContentStyleOverrides] = useState<React.CSSProperties>({})
  const [contentBlockStyleOverrides, setContentBlockStyleOverrides] = useState<React.CSSProperties>({})

  // Set the page title
  useEffect(() => {
    setPageTitle(title)
  }, [title])

  // Set the correct styles initially, based on screen media query
  useEffect(() => {
    // run func
  }, [])

  if (state.status === "loading") {
    contentStyle = { alignItems: "center" }
    contentBlockStyle = { maxHeight: "15%", maxWidth: "15%" }
  } else if (state.status === "Error") {
    contentStyle = { alignItems: "center" }
    contentBlockStyle = { maxHeight: "40%", maxWidth: "40%" }
  }

  return (
    <div className="page-background" style={backgroundStyle}>
      {state.status !== "loading" && <Navbar componentRefs={navbarRefs} />}
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