import type { ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  id?: string
}

export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled, id }: ButtonProps) {
  const colors: Record<string, string> = {
    primary: '#2563eb',
    secondary: '#6b7280',
    danger: '#dc2626',
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: colors[variant],
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}