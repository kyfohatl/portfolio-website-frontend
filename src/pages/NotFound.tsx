import PageContainer from "../components/PageContainer";

export default function NotFound() {
  return (
    <PageContainer title="Page Not Found" state={{ status: "Error", errorCode: "404" }}>
      <div></div>
    </PageContainer>
  )
}