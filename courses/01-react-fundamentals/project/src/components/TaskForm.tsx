import { useState } from 'react'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
  categories?: string[]
}

export default function TaskForm({ onAddTask, categories = ['General', 'Work', 'Personal'] }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState(categories[0] ?? 'General')
  const [tagsInput, setTagsInput] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    onAddTask?.({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      tags,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory(categories[0] ?? 'General')
    setTagsInput('')
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
      <label htmlFor="task-category">Category</label>
      <select
        id="task-category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label htmlFor="task-tags-input">Tags (comma separated)</label>
      <input
        id="task-tags-input"
        type="text"
        placeholder="e.g. urgent, frontend"
        value={tagsInput}
        onChange={e => setTagsInput(e.target.value)}
      />
      {error && <p id="task-form-error">{error}</p>}
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  )
}