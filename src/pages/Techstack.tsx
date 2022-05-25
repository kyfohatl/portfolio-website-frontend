import { useEffect } from "react"
import Error from "../components/Error"
import Loading from "../components/Loading"
import LoadingButton from "../components/LoadingButton"
import PageContainer from "../components/PageContainer"
import SavingButton from "../components/SavingButton"
import useRefState from "../hooks/useRefState"

export default function Techstack() {
  const [state, ref, setVals] = useRefState(true)
  console.log("Ah", ref.current)

  useEffect(() => {
    console.log("YO", ref.current)
  }, [ref])

  return (
    <PageContainer state={{ status: "normal" }}>
      <button onClick={() => { setVals(!ref.current) }} >Click</button>
    </PageContainer>
  )
}