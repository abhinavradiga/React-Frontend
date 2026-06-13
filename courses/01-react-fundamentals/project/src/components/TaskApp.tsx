import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'First Task', description: 'First hardcoded task', priority: 'High', completed: false },
  { id: 2, title: 'Second Task', description: 'Second hardcoded task', priority: 'Medium', completed: false },
  { id: 3, title: 'Third Task', description: 'Third hardcoded task', priority: 'Low', completed: false },
  { id: 4, title: 'Fourth Task', description: 'Fourth hardcoded task', priority: 'High', completed: false },
  { id: 5, title: 'Fifth Task', description: 'Fifth hardcoded task', priority: 'Medium', completed: false },
]

export default function TaskApp({ tasks, setTasks, dispatch, showForm, countFormat, onDelete }: TaskAppProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(DEFAULT_TASKS)
  const displayTasks = tasks ?? localTasks
  const setDisplayTasks = setTasks ?? setLocalTasks

  function handleAddTask(task: Record<string, unknown>) {
    const newTask = task as Task
    if (dispatch) {
      dispatch({ type: 'ADD_TASK', payload: newTask })
    } else {
      setDisplayTasks(prev => [...prev, newTask])
    }
  }

  function handleToggle(id: string | number) {
    if (dispatch) {
      dispatch({ type: 'TOGGLE_TASK', payload: id })
    } else {
      setDisplayTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    }
  }

  function handleDelete(id: string | number) {
    if (dispatch) {
      dispatch({ type: 'DELETE_TASK', payload: id })
    } else {
      setDisplayTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  const completedCount = displayTasks.filter(t => t.completed).length
  const countText = countFormat === 'completed'
    ? `${completedCount} of ${displayTasks.length} completed`
    : `${displayTasks.length} Tasks`

  return (
    <div id="task-app">
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      <TaskList
        tasks={displayTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={onDelete ?? handleDelete}
      />
    </div>
  )
}