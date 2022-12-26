export default function setPageTitle(title: string) {
  if (title === "") return document.title = "Ehsan's Blog"
  document.title = `${title} | Ehsan's Blog`
}