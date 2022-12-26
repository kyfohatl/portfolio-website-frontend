import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer, { PageContainerState } from "../../components/PageContainer";
import Api from "../../lib/api/Api";
import { FrontendError } from "../../lib/commonTypes";

export default function FacebookRedirect() {
  const [pageState, setPageState] = useState<PageContainerState>({ status: "loading" })

  const navigate = useNavigate()
  const location = useLocation()

  // Remove the "#" symbol from the first fragment
  const params = new URLSearchParams(location.hash.slice(1))
  // Now extract the id token from fragments
  const idToken = params.get("id_token")

  useEffect(() => {
    async function postCallback() {
      try {
        const response = await Api.postFacebookOpenIdCallback(idToken)
        // Successful callback response. Tokens have been set
        // Now set user id
        localStorage.setItem("userId", response.success.userId)
        // Finally redirect to the home page
        // Replace top of route stack to prevent coming back to this page
        navigate("/", { replace: true })
      } catch (err) {
        const castError = err as FrontendError
        castError.outputErrorToConsole()
        setPageState({ status: "Error", errorCode: castError.code + "" })
      }
    }

    postCallback()
  }, [idToken, navigate])

  return (
    <PageContainer title="Facebook Sign In" state={pageState}>
    </PageContainer>
  )
}