import "./InputText.css"

interface InputTextProps {
  label: string
}

export default function InputText({ label }: InputTextProps) {
  return (
    <>
      <label className="input-text-label">
        <p className="label">{label}</p>
        <input type="text" name={label} className="input-text-box" />
      </label>
    </>
  )
}