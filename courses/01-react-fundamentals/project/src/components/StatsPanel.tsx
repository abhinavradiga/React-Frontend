interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({ total = 0, completed = 0, active, overdue }: StatsPanelProps) {
  return (
    <div id="stats-panel">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Active: {active ?? total - completed}</p>
      {overdue !== undefined && <p>Overdue: {overdue}</p>}
    </div>
  )
}