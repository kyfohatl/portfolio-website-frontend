import { useEffect } from "react"
import AnimatedButton from "../components/AnimatedButton"
import Deleting from "../components/animation/Deleting"
import Saving from "../components/animation/Saving"
import Button from "../components/Button"
import Error from "../components/Error"
import HelpDisplay from "../components/help/HelpDisplay"
import HelpDisplaySideButton from "../components/help/HelpDisplaySideButton"
import Loading from "../components/Loading"
import LoadingButton from "../components/LoadingButton"
import PageContainer from "../components/PageContainer"
import useRefState from "../hooks/useRefState"

export default function Techstack() {
  const [state, ref, setVals] = useRefState(true)
  console.log("Ah", ref.current)

  useEffect(() => {
    console.log("YO", ref.current)
  }, [ref])

  return (
    <PageContainer state={{ status: "normal" }}>
      {/* <HelpDisplaySideButton direction="right" callBack={() => { }} /> */}
      <HelpDisplay />
    </PageContainer>
  )
}