import { useEffect } from "react"
import AnimatedButton from "../components/AnimatedButton"
import Deleting from "../components/animation/Deleting"
import Saving from "../components/animation/Saving"
import Button from "../components/Button"
import Error from "../components/Error"
import { FeatureDisplayCardProps } from "../components/FeatureDisplayCard"
import HelpDisplay from "../components/help/HelpDisplay"
import HelpDisplaySideButton from "../components/help/HelpDisplaySideButton"
import Loading from "../components/Loading"
import LoadingButton from "../components/LoadingButton"
import PageContainer from "../components/PageContainer"
import useRefState from "../hooks/useRefState"

import TypeScriptLogo from "../assets/images/homePageDemos/techstackLogos/typescript_logo.png"

const DIMENSIONS = { width: "600px", height: "450px" }
const borderRadius = "40px"

const props: FeatureDisplayCardProps[] = [
  {
    title: "Title 1",
    notes: ["Some pointer 1", "Some Pointer 2"],
    visuals: { images: [{ imgLink: TypeScriptLogo, height: "100px", width: "100px" }] },
    dimensions: DIMENSIONS,
    borderRadius: borderRadius
  },
  {
    title: "Title 2",
    notes: ["Some pointer 1", "Some Pointer 2"],
    visuals: { images: [{ imgLink: TypeScriptLogo, height: "100px", width: "100px" }] },
    dimensions: DIMENSIONS,
    borderRadius: borderRadius
  },
  {
    title: "Title 3",
    notes: ["Some pointer 1", "Some Pointer 2"],
    visuals: { images: [{ imgLink: TypeScriptLogo, height: "100px", width: "100px" }] },
    dimensions: DIMENSIONS,
    borderRadius: borderRadius
  },
  {
    title: "Title 4",
    notes: ["Some pointer 1", "Some Pointer 2"],
    visuals: { images: [{ imgLink: TypeScriptLogo, height: "100px", width: "100px" }] },
    dimensions: DIMENSIONS,
    borderRadius: borderRadius
  },
  {
    title: "Title 5",
    notes: ["Some pointer 1", "Some Pointer 2"],
    visuals: { images: [{ imgLink: TypeScriptLogo, height: "100px", width: "100px" }] },
    dimensions: DIMENSIONS,
    borderRadius: borderRadius
  }
]

export default function Techstack() {
  const [state, ref, setVals] = useRefState(true)
  console.log("Ah", ref.current)

  useEffect(() => {
    console.log("YO", ref.current)
  }, [ref])

  return (
    <PageContainer state={{ status: "normal" }}>
      <HelpDisplay cardProps={props} onClose={() => console.log("Closing!")} />
    </PageContainer>
  )
}