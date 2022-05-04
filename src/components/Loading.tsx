import styles from "./Loading.module.css"

export default function Loading() {
  return (
    <svg className={styles.indicator} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47.5" stroke="#8B0000" strokeWidth="5" />
      <circle cx="50" cy="50" r="37.5" stroke="#B57F50" strokeWidth="5" />
      <circle cx="50" cy="50" r="27.5" stroke="#8B0000" strokeWidth="5" />
      <circle cx="50" cy="51" r="17.5" stroke="#B57F50" strokeWidth="5" />
      <circle cx="50" cy="51" r="7.5" stroke="#8B0000" strokeWidth="5" />
    </svg>
  )
}