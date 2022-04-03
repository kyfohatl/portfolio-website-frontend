import "./InputText.css"

interface InputTextProps {
  label: string,
  state: string,
  setState: (newState: string) => void
}

export default function InputText({ label, state, setState }: InputTextProps) {
  return (
    <>
      <label className="input-text-label">
        <p className="label">{label}</p>
        <input
          type="text"
          name={label}
          className="input-text-box"
          value={state}
          onChange={(e) => { setState(e.target.value) }}
        />
      </label>
    </>
  )
}