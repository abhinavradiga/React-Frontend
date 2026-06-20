import { useState } from 'react'

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

function getDueDateInfo(dueDate?: string | number, completed?: boolean) {
  if (!dueDate) return null
  const due = new Date(dueDate)
  const now = new Date()
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86400000)

  const formatted = due.toLocaleDateString()
  let label = ''
  let overdue = false

  if (!completed && diffDays < 0) {
    label = 'Overdue'
    overdue = true
  } else if (diffDays === 0) {
    label = 'Due Today'
  } else if (diffDays > 0 && diffDays <= 3) {
    label = 'Due Soon'
  }

  return { formatted, label, overdue }
}

export default function TaskCard({
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

  const dueDateInfo = getDueDateInfo(dueDate, completed)

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
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </article>
    )
  }

  return (
    <article id="task-card" data-completed={completed ? 'true' : undefined} data-overdue={dueDateInfo?.overdue ? 'true' : undefined}>
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
      {category && <p id="task-category">{category}</p>}
      {tags && tags.length > 0 && (
        <div id="task-tags">
          {tags.map(tag => (
            <span key={tag} data-tag>{tag}</span>
          ))}
        </div>
      )}
      {dueDateInfo && (
        <p id="task-due-date">
          {dueDateInfo.formatted}{dueDateInfo.label && ` — ${dueDateInfo.label}`}
        </p>
      )}
      {onUpdateTask && (
        <button onClick={handleEditClick}>Edit</button>
      )}
      {onDelete && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </article>
  )
}