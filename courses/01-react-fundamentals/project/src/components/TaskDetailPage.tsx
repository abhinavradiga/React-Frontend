interface TaskDetailPageProps {
  taskId?: string | number
  onBack?: () => void
}

export default function TaskDetailPage({ onBack }: TaskDetailPageProps) {
  return (
    <div id="task-detail-page">
      <button id="task-detail-back" onClick={onBack}>Back</button>
    </div>
  )
}