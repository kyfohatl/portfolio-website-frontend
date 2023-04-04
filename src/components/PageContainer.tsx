import "./PageContainer.css"

import Navbar, { NavbarComponentRefs } from "./navbar/Navbar"
import Loading from "./Loading"
import Error from "./Error"
import React, { useCallback, useEffect, useState } from "react"
import setPageTitle from "../lib/helpers/setPageTitle"

export type PageContainerState = { status: "normal" | "loading" } | { status: "Error", errorCode: string }
export type PageContainerStyles =
  { desktop: React.CSSProperties, mobile: React.CSSProperties } |
  { unified: React.CSSProperties }

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

const DEFAULT_STYLE = { unified: {} }

const mql = window.matchMedia("(max-width: 1100px)")

export default function PageContainer({
  title,
  backgroundStyle = DEFAULT_STYLE,
  contentStyle = DEFAULT_STYLE,
  contentBlockStyle = DEFAULT_STYLE,
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

  // Switch style overrides depending on current screen size
  const switchStylesWithMq = useCallback(() => {
    if (mql.matches) {
      // On mobile screen. Apply mobile style overrides
      if (!("unified" in backgroundStyle)) setBckgStyleOverrides(backgroundStyle.mobile)
      if (!("unified" in contentStyle)) setContentStyleOverrides(contentStyle.mobile)
      if (!("unified" in contentBlockStyle)) setContentBlockStyleOverrides(contentBlockStyle.mobile)
      return
    }

    // On a desktop screen. Apply desktop style overrides
    if (!("unified" in backgroundStyle)) setBckgStyleOverrides(backgroundStyle.desktop)
    if (!("unified" in contentStyle)) setContentStyleOverrides(contentStyle.desktop)
    if (!("unified" in contentBlockStyle)) setContentBlockStyleOverrides(contentBlockStyle.desktop)
  }, [backgroundStyle, contentStyle, contentBlockStyle])

  // Set all style overrides based on the given props and media query
  const setStyles = useCallback(() => {
    if ("unified" in backgroundStyle) setBckgStyleOverrides(backgroundStyle.unified)
    if ("unified" in contentStyle) setContentStyleOverrides(contentStyle.unified)
    if ("unified" in contentBlockStyle) setContentBlockStyleOverrides(contentBlockStyle.unified)

    switchStylesWithMq()
  }, [backgroundStyle, contentStyle, contentBlockStyle, switchStylesWithMq])

  // Set initial styles and set event handler for changing them on the MediaQueryList object
  useEffect(() => {
    // Set the initial styles
    setStyles()

    // If the media query changes, change the styles with it
    mql.addEventListener("change", switchStylesWithMq)

    // Clean up
    return () => {
      mql.removeEventListener("change", switchStylesWithMq)
    }
  }, [setStyles, switchStylesWithMq])

  // Override styles if the page is in a specific state
  useEffect(() => {
    switch (state.status) {
      case "loading":
        setContentStyleOverrides({ alignItems: "center" })
        setContentBlockStyleOverrides({ maxHeight: "15%", maxWidth: "15%" })
        break
      case "Error":
        setContentStyleOverrides({ alignItems: "center" })
        setContentBlockStyleOverrides({ maxHeight: "40%", maxWidth: "40%" })
        break
      default:
        // Normal state. Set normal style overrides based on given props and media query
        setStyles()
        break;
    }
  }, [state.status, setStyles])

  return (
    <div className="page-background" style={bckgStyleOverrides}>
      {state.status !== "loading" && <Navbar componentRefs={navbarRefs} />}
      <div className="content" style={contentStyleOverrides} data-testid={contentTestId}>
        <div className="content-block" style={contentBlockStyleOverrides}>
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