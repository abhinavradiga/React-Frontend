import { useState } from 'react'
import FormInput from './FormInput'
import Button from './Button'

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
  const [dueDate, setDueDate] = useState('')
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
      dueDate: dueDate || undefined,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory(categories[0] ?? 'General')
    setTagsInput('')
    setDueDate('')
    setError('')
  }

  return (
    <div id="task-form">
      <FormInput
        id="task-title"
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title"
        error={error || undefined}
      />
      <FormInput
        id="task-description"
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Task description"
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
      <FormInput
        id="task-tags-input"
        label="Tags (comma separated)"
        value={tagsInput}
        onChange={e => setTagsInput(e.target.value)}
        placeholder="e.g. urgent, frontend"
      />
      <label htmlFor="task-due-date-input">Due Date</label>
      <input
        id="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <Button onClick={handleSubmit} variant="primary" type="button">Add Task</Button>
    </div>
  )
}