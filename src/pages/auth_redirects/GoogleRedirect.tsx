import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer, { PageContainerState } from "../../components/PageContainer";

export default function GoogleRedirect() {
  const [pageState, setPageState] = useState<PageContainerState>({ status: "loading" })
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search.slice(1))
  const userId = params.get("userid")

  useEffect(() => {
    // Ensure a user id is given
    if (!userId) return setPageState({ status: "Error", errorCode: "400" })
    // Save user id
    localStorage.setItem("userId", userId)
    // Now redirect to home page
    navigate("/", { replace: true })
  }, [userId, navigate])

  return (
    <PageContainer title="Google Sign In" state={pageState}>
    </PageContainer>
  )
}