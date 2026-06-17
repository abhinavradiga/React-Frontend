import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'

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

type Filter = 'all' | 'active' | 'completed'

export default function TaskApp({ tasks, setTasks, dispatch, showForm, countFormat, showFilterBar, onDelete }: TaskAppProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(DEFAULT_TASKS)
  const [filter, setFilter] = useState<Filter>('all')

  const displayTasks = tasks ?? localTasks
  const setDisplayTasks = setTasks ?? setLocalTasks

  const filteredTasks = filter === 'active'
    ? displayTasks.filter(t => !t.completed)
    : filter === 'completed'
    ? displayTasks.filter(t => t.completed)
    : displayTasks

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
    : showFilterBar && filter !== 'all'
    ? `Showing ${filteredTasks.length} of ${displayTasks.length} tasks`
    : `${displayTasks.length} Tasks`

  return (
    <div id="task-app">
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {showFilterBar && (
        <FilterBar filter={filter} onFilterChange={f => setFilter(f as Filter)} />
      )}
      {filteredTasks.length === 0 && (
        <p id="filter-empty-message">No tasks match this filter</p>
      )}
      <TaskList
        tasks={filteredTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={onDelete ?? handleDelete}
      />
    </div>
  )
}