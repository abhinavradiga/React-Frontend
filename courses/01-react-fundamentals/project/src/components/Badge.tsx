import type { ReactNode } from 'react'

interface BadgeProps {
  children?: ReactNode
  variant?: 'default' | 'priority-high' | 'priority-medium' | 'priority-low' | 'category' | 'tag'
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors: Record<string, string> = {
    default: '#e5e7eb',
    'priority-high': '#fecaca',
    'priority-medium': '#fde68a',
    'priority-low': '#bbf7d0',
    category: '#dbeafe',
    tag: '#f3e8ff',
  }

  return (
    <span
      data-badge
      style={{
        background: colors[variant] ?? colors.default,
        borderRadius: '9999px',
        padding: '2px 8px',
        fontSize: '12px',
        display: 'inline-block',
        marginRight: '4px',
      }}
    >
      {children}
    </span>
  )
}