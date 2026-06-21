interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
  byCategory?: Record<string, number>
  byPriority?: Record<string, number>
}

export default function StatsPanel({ total = 0, completed = 0, active, overdue, completedPercentage, byCategory, byPriority }: StatsPanelProps) {
  const computedActive = active ?? total - completed
  const percentage = completedPercentage ?? (total > 0 ? Math.round((completed / total) * 100) : 0)

  return (
    <div id="stats-panel">
      <p>Total: {total}</p>
      <p>Completed: {completed} ({percentage}%)</p>
      <p>Active: {computedActive}</p>
      <p>Overdue: {overdue ?? 0}</p>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ background: '#eee', borderRadius: '4px', height: '8px', width: '100%' }}
      >
        <div style={{ background: '#22c55e', height: '100%', width: `${percentage}%`, borderRadius: '4px' }} />
      </div>
      {byCategory && (
        <div id="stats-by-category">
          {Object.entries(byCategory).map(([cat, count]) => (
            <p key={cat}>{cat}: {count}</p>
          ))}
        </div>
      )}
      {byPriority && (
        <div id="stats-by-priority">
          {Object.entries(byPriority).map(([pri, count]) => (
            <p key={pri}>{pri}: {count}</p>
          ))}
        </div>
      )}
    </div>
  )
}