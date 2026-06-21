import { useState, memo } from 'react'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'

interface TaskCardProps {
  title: string
  description: string
  priority?: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void
  isEditing?: boolean
  onStartEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  taskId?: string | number
  id?: string | number
}

function getDueDateStatus(dueDate?: string | number, completed?: boolean): 'overdue' | 'due-today' | 'due-soon' | undefined {
  if (!dueDate || completed) return undefined
  const due = new Date(dueDate)
  const now = new Date()
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86400000)

  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'due-today'
  if (diffDays > 0 && diffDays <= 3) return 'due-soon'
  return undefined
}

function priorityVariant(priority?: string): 'priority-high' | 'priority-medium' | 'priority-low' | 'default' {
  if (!priority) return 'default'
  if (priority.toLowerCase().includes('high')) return 'priority-high'
  if (priority.toLowerCase().includes('medium')) return 'priority-medium'
  if (priority.toLowerCase().includes('low')) return 'priority-low'
  return 'default'
}

function TaskCard({
  title, description, priority, completed, category, tags, dueDate,
  onToggle, onDelete, onUpdateTask,
  isEditing, onStartEdit, onCancelEdit,
  taskId, id,
}: TaskCardProps) {
  const resolvedId = taskId ?? id ?? 0
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPriority, setEditPriority] = useState(priority ?? 'Medium')
  const [error, setError] = useState('')

  const priorityLabel = priority
    ? priority.startsWith('Priority:') ? priority : `Priority: ${priority}`
    : ''

  const dueDateStatus = getDueDateStatus(dueDate, completed)
  const dueDateFormatted = dueDate ? new Date(dueDate).toLocaleDateString() : null

  function handleDelete() {
    if (onDelete && window.confirm('Delete this task?')) {
      onDelete(resolvedId)
    }
  }

  function handleEditClick() {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority ?? 'Medium')
    setError('')
    onStartEdit?.(resolvedId)
  }

  function handleSave() {
    if (!editTitle.trim()) {
      setError('Title is required')
      return
    }
    onUpdateTask?.(resolvedId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    })
    setError('')
  }

  function handleCancel() {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority ?? 'Medium')
    setError('')
    onCancelEdit?.()
  }

  if (isEditing) {
    return (
      <article id="task-card" data-editing="true">
        <label htmlFor={`edit-title-${resolvedId}`}>Title</label>
        <input
          id={`edit-title-${resolvedId}`}
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
        <label htmlFor={`edit-description-${resolvedId}`}>Description</label>
        <input
          id={`edit-description-${resolvedId}`}
          type="text"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
        />
        <label htmlFor={`edit-priority-${resolvedId}`}>Priority</label>
        <select
          id={`edit-priority-${resolvedId}`}
          value={editPriority}
          onChange={e => setEditPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {error && <p id="task-edit-error">{error}</p>}
        <Button onClick={handleSave} variant="primary">Save</Button>
        <Button onClick={handleCancel} variant="secondary">Cancel</Button>
      </article>
    )
  }

  return (
    <article id="task-card" data-completed={completed ? 'true' : undefined} data-overdue={dueDateStatus === 'overdue' ? 'true' : undefined}>
      {onToggle && (
        <input
          type="checkbox"
          checked={!!completed}
          onChange={() => onToggle(resolvedId)}
          aria-label={`Toggle ${title}`}
        />
      )}
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>{title}</h2>
      <p>{description}</p>
      <p>{priorityLabel}</p>
      <Badge variant={priorityVariant(priority)}>{priority}</Badge>
      {category && <p id="task-category"><Badge variant="category">{category}</Badge></p>}
      {tags && tags.length > 0 && (
        <div id="task-tags">
          {tags.map(tag => (
            <Badge key={tag} variant="tag">{tag}</Badge>
          ))}
        </div>
      )}
      {dueDateFormatted && (
        <p id="task-due-date">
          {dueDateFormatted}{dueDateStatus && <StatusIndicator status={dueDateStatus} />}
        </p>
      )}
      {onUpdateTask && (
        <Button onClick={handleEditClick} variant="secondary">Edit</Button>
      )}
      {onDelete && (
        <Button onClick={handleDelete} variant="danger">Delete</Button>
      )}
    </article>
  )
}

export default memo(TaskCard)