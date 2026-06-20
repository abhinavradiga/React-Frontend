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
type SortOrder = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical'

const PRIORITY_RANK: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

export default function TaskApp({ tasks, setTasks, dispatch, showForm, countFormat, showFilterBar, onDelete }: TaskAppProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(DEFAULT_TASKS)
  const [filter, setFilter] = useState<Filter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [search, setSearch] = useState('')

  const displayTasks = tasks ?? localTasks
  const setDisplayTasks = setTasks ?? setLocalTasks

  const statusFiltered = filter === 'active'
    ? displayTasks.filter(t => !t.completed)
    : filter === 'completed'
    ? displayTasks.filter(t => t.completed)
    : displayTasks

  const searched = search.trim()
    ? statusFiltered.filter(t =>
        t.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        t.description.toLowerCase().includes(search.trim().toLowerCase())
      )
    : statusFiltered

  const sortedTasks = [...searched].sort((a, b) => {
    if (sortOrder === 'priority-high') {
      return (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1)
    }
    if (sortOrder === 'priority-low') {
      return (PRIORITY_RANK[b.priority] ?? 1) - (PRIORITY_RANK[a.priority] ?? 1)
    }
    if (sortOrder === 'alphabetical') {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    }
    return 0
  })

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

  function handleUpdateTask(id: string | number, updates: { title: string; description: string; priority: string }) {
    if (dispatch) {
      dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } })
    } else {
      setDisplayTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }
    setEditingId(null)
  }

  const completedCount = displayTasks.filter(t => t.completed).length

  const countText = countFormat === 'completed'
    ? `${completedCount} of ${displayTasks.length} completed`
    : showFilterBar && (filter !== 'all' || search.trim())
    ? `Showing ${sortedTasks.length} of ${displayTasks.length} tasks`
    : `${displayTasks.length} Tasks`

  return (
    <div id="task-app">
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={f => setFilter(f as Filter)}
          sortOrder={sortOrder}
          onSortChange={s => setSortOrder(s as SortOrder)}
          searchValue={search}
          onSearchChange={setSearch}
        />
      )}
      {sortedTasks.length === 0 && (
        <p id="filter-empty-message">
          {search.trim() ? `No tasks found for "${search.trim()}"` : 'No tasks match this filter'}
        </p>
      )}
      <TaskList
        tasks={sortedTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={onDelete ?? handleDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onStartEdit={setEditingId}
        onCancelEdit={() => setEditingId(null)}
      />
    </div>
  )
}