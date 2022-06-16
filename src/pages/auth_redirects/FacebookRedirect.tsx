import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import PageContainer from "../../components/PageContainer";

export default function FacebookRedirect() {
  const location = useLocation()
  const params = new URLSearchParams(location.hash.slice(1))
  const idToken = params.get("id_token")

  useEffect(() => {
    if (!idToken) return console.error(new Error("No id token given!"))
    try {
      const response = fetch("http://localhost:8000/auth/login/facebook/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_token: idToken })
      })
    } catch (err) {
      console.error(err)
    }
  }, [idToken])

  return (
    <PageContainer>
      <Loading />
    </PageContainer>
  )
}