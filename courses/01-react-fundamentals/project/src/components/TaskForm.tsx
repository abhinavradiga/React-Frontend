import { useState } from 'react'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    onAddTask?.({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setError('')
  }

  return (
    <div id="task-form">
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <label htmlFor="task-description">Description</label>
      <input
        id="task-description"
        type="text"
        placeholder="Task description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={e => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      {error && <p id="task-form-error">{error}</p>}
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  )
}