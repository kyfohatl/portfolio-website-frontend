import { useEffect } from "react"
import AnimatedButton from "../components/AnimatedButton"
import Deleting from "../components/animation/Deleting"
import Button from "../components/Button"
import Error from "../components/Error"
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
      <Button width="100px" height="36px" text="Abc" type={{ type: "submit" }} buttonState={{ state: "animated", animation: <Deleting onAnimationEnd={() => { console.log("YOYOY") }} /> }} />
    </PageContainer>
  )
}