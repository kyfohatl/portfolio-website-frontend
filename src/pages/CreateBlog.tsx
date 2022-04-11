import Editor from "../components/blog/Editor";
import PageContainer from "../components/PageContainer";

export default function CreateBlog() {
  return (
    <PageContainer
      contentStyle={{ marginTop: "56px" }}
      contentBlockStyle={{ display: "flex", justifyContent: "space-between", maxWidth: "80vw" }}
    >
      <Editor />
      <Editor />
    </PageContainer>
  )
}