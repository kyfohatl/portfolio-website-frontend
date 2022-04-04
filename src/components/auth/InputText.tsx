import "./InputText.css"

interface InputTextProps {
  label: string,
  text: string,
  setText: (newState: string) => void,
  errorText: string
}

export default function InputText({ label, text, setText, errorText }: InputTextProps) {
  return (
    <>
      <label className="input-text-label">
        <p className="label">{label}</p>
        <input
          type="text"
          name={label}
          className={errorText ? "input-text-box-error" : "input-text-box"}
          value={text}
          onChange={(e) => { setText(e.target.value) }}
        />
        {errorText &&
          <p className="label-error">{errorText}</p>
        }
      </label>
    </>
  )
}