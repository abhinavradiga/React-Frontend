interface StatusIndicatorProps {
  status?: 'overdue' | 'due-today' | 'due-soon' | 'completed'
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  overdue: { label: 'Overdue', color: '#dc2626' },
  'due-today': { label: 'Due Today', color: '#d97706' },
  'due-soon': { label: 'Due Soon', color: '#2563eb' },
  completed: { label: 'Completed', color: '#16a34a' },
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (!status) return null
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <span
      data-status={status}
      style={{
        color: config.color,
        fontWeight: 600,
        fontSize: '12px',
      }}
    >
      {config.label}
    </span>
  )
}