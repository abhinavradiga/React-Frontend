import { useState } from 'react'

interface TaskCardProps {
  title: string
  description: string
  priority?: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void
  isEditing?: boolean
  onStartEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  taskId?: string | number
  id?: string | number
}

export default function TaskCard({
  title, description, priority, completed,
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
    <article id="task-card" data-completed={completed ? 'true' : undefined}>
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
      {onUpdateTask && (
        <button onClick={handleEditClick}>Edit</button>
      )}
      {onDelete && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </article>
  )
}