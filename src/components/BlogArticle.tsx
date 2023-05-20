import styles from "./BlogArticle.module.css"

interface BlogArticleProps {
  children: React.ReactNode,
  title: string
}

export default function BlogArticle({ children, title }: BlogArticleProps) {
  return (
    <article className={styles.articleContainer}>
      <h1>{title}</h1>
      <div>{children}</div>
    </article>
  )
}