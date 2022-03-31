import "./BlogArticle.css"

interface BlogArticleProps {
  children: React.ReactNode,
  title: string
}

export default function BlogArticle({ children, title }: BlogArticleProps) {
  return (
    <article className="blog-article">
      <h2>{title}</h2>
      {children}
    </article>
  )
}