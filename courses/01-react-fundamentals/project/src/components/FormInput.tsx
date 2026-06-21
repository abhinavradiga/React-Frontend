interface FormInputProps {
  id?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  error?: string
}

export default function FormInput({ id, label, value, onChange, type = 'text', placeholder, error }: FormInputProps) {
  return (
    <div>
      {label && id && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <p>{error}</p>}
    </div>
  )
}