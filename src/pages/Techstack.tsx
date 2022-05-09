import Error from "../components/Error"
import Loading from "../components/Loading"
import LoadingButton from "../components/LoadingButton"
import PageContainer from "../components/PageContainer"
import SavingButton from "../components/SavingButton"

export default function Techstack() {
  return (
    <PageContainer state={{ status: "Error", errorCode: "500" }}>
    </PageContainer>
  )
}