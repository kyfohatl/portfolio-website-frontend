import styles from "./SavingButton.module.css"

export default function SavingButton() {
  return (
    <button className={styles.button}>
      <div className={styles.tick}></div>
      Saved
    </button>
  )
}