import styles from "./BlogArticle.module.css"

interface BlogArticleProps {
  children: React.ReactNode,
  title: string
}

export default function BlogArticle({ children, title }: BlogArticleProps) {
  return (
    <article className={styles.articleContainer}>
      <h2>{title}</h2>
      {children}
    </article>
  )
}