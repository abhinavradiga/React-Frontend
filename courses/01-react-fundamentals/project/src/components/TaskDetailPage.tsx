import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Task } from './TaskList'

const DEFAULT_TASKS: Task[] = []

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tasks] = useLocalStorage<Task[]>('task-app-tasks', DEFAULT_TASKS)

  const task = tasks.find(t => String(t.id) === String(id))

  function handleBack() {
    navigate('/challenge/21-react-router')
  }

  if (!task) {
    return (
      <div id="task-detail-page">
        <p>Task not found.</p>
        <button id="task-detail-back" onClick={handleBack}>Back to list</button>
      </div>
    )
  }

  return (
    <div id="task-detail-page">
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      {task.category && <p>Category: {task.category}</p>}
      {task.tags && task.tags.length > 0 && <p>Tags: {task.tags.join(', ')}</p>}
      {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
      <button id="task-detail-back" onClick={handleBack}>Back to list</button>
    </div>
  )
}