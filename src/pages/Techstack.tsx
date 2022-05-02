import LoadingButton from "../components/LoadingButton"
import SavingButton from "../components/SavingButton"

export default function Techstack() {
  return (
    <>
      <p>This is the techstack page</p>
      <SavingButton width="100px" height="40px" onAnimationEnd={() => console.log("Anim Done")} />
      <LoadingButton width="100px" height="40px" />
    </>
  )
}