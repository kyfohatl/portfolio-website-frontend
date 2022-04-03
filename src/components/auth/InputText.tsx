import "./InputText.css"

interface InputTextProps {
  label: string,
  text: string,
  setText: (newState: string) => void,
  error: boolean,
  errorText: string
}

export default function InputText({ label, text, setText, error, errorText }: InputTextProps) {
  return (
    <>
      <label className="input-text-label">
        <p className="label">{label}</p>
        <input
          type="text"
          name={label}
          className={error ? "input-text-box-error" : "input-text-box"}
          value={text}
          onChange={(e) => { setText(e.target.value) }}
        />
        {error &&
          <p className="label-error">{errorText}</p>
        }
      </label>
    </>
  )
}