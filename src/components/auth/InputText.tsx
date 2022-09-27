import "./InputText.css"

interface InputTextProps {
  label: string,
  text: string,
  type?: "text" | "password",
  setText: (newState: string) => void,
  errorText: string
}

export default function InputText({ label, text, type = "text", setText, errorText }: InputTextProps) {
  return (
    <>
      <label data-testid={"labelContainer" + label} className="input-text-label">
        <p className="label">{label}</p>
        <input
          type={type}
          name={label}
          className={errorText ? "input-text-box-error" : "input-text-box"}
          value={text}
          onChange={(e) => { setText(e.target.value) }}
        />
        {errorText &&
          <p data-testid={"errorLabel" + label} className="label-error">{errorText}</p>
        }
      </label>
    </>
  )
}