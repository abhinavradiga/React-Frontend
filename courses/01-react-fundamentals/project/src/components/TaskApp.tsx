import { useState, useEffect, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'

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

const STORAGE_KEY = 'task-app-tasks'

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'First Task', description: 'First hardcoded task', priority: 'High', completed: false, category: 'General', tags: [] },
  { id: 2, title: 'Second Task', description: 'Second hardcoded task', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 3, title: 'Third Task', description: 'Third hardcoded task', priority: 'Low', completed: false, category: 'General', tags: [] },
  { id: 4, title: 'Fourth Task', description: 'Fourth hardcoded task', priority: 'High', completed: false, category: 'General', tags: [] },
  { id: 5, title: 'Fifth Task', description: 'Fifth hardcoded task', priority: 'Medium', completed: false, category: 'General', tags: [] },
]

function normalizeTask(t: Partial<Task>): Task {
  return {
    id: t.id ?? Date.now(),
    title: t.title ?? '',
    description: t.description ?? '',
    priority: t.priority ?? 'Medium',
    completed: t.completed ?? false,
    category: t.category ?? 'General',
    tags: Array.isArray(t.tags) ? t.tags : [],
    dueDate: t.dueDate,
  }
}

function loadInitialTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_TASKS
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) return parsed.map(normalizeTask)
    return DEFAULT_TASKS
  } catch {
    return DEFAULT_TASKS
  }
}

type Filter = 'all' | 'active' | 'completed'
type SortOrder = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical' | 'due-date'

const PRIORITY_RANK: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button id="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  )
}

function TaskAppInner({ tasks, setTasks, dispatch, showForm, countFormat, showFilterBar, showStatsPanel, onDelete }: TaskAppProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(loadInitialTasks)
  const [filter, setFilter] = useState<Filter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')

  const displayTasks = tasks ?? localTasks
  const setDisplayTasks = setTasks ?? setLocalTasks

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(displayTasks))
    } catch {
      // ignore storage errors
    }
  }, [displayTasks])

  useEffect(() => {
    setIsSearching(search !== debouncedSearch)
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const stats = useMemo(() => {
    const total = displayTasks.length
    const completed = displayTasks.filter(t => t.completed).length
    const active = total - completed
    const now = new Date()
    const overdue = displayTasks.filter(t => {
      if (t.completed || !t.dueDate) return false
      return new Date(t.dueDate) < now
    }).length
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    const byCategory: Record<string, number> = {}
    const byPriority: Record<string, number> = {}
    displayTasks.forEach(t => {
      const cat = t.category ?? 'General'
      byCategory[cat] = (byCategory[cat] ?? 0) + 1
      byPriority[t.priority] = (byPriority[t.priority] ?? 0) + 1
    })

    return { total, completed, active, overdue, completedPercentage, byCategory, byPriority }
  }, [displayTasks])

  const categories = [...new Set(displayTasks.map(t => t.category).filter((c): c is string => Boolean(c)))]

  const statusFiltered = filter === 'active'
    ? displayTasks.filter(t => !t.completed)
    : filter === 'completed'
    ? displayTasks.filter(t => t.completed)
    : displayTasks

  const categoryFiltered = categoryFilter !== 'all'
    ? statusFiltered.filter(t => t.category === categoryFilter)
    : statusFiltered

  const searched = debouncedSearch.trim()
    ? categoryFiltered.filter(t =>
        t.title.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) ||
        t.description.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
      )
    : categoryFiltered

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
    if (sortOrder === 'due-date') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  function handleAddTask(task: Record<string, unknown>) {
    const newTask = normalizeTask(task as Partial<Task>)
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

  const countText = countFormat === 'completed'
    ? `${stats.completed} of ${displayTasks.length} completed`
    : showFilterBar && (filter !== 'all' || debouncedSearch.trim() || categoryFilter !== 'all')
    ? `Showing ${sortedTasks.length} of ${displayTasks.length} tasks`
    : `${displayTasks.length} Tasks`

  return (
    <div id="task-app">
      <ThemeToggle />
      {showStatsPanel && (
        <StatsPanel
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          overdue={stats.overdue}
          completedPercentage={stats.completedPercentage}
          byCategory={stats.byCategory}
          byPriority={stats.byPriority}
        />
      )}
      {showForm && <TaskForm onAddTask={handleAddTask} categories={categories.length > 0 ? categories : ['General', 'Work', 'Personal']} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={f => setFilter(f as Filter)}
          sortOrder={sortOrder}
          onSortChange={s => setSortOrder(s as SortOrder)}
          searchValue={search}
          onSearchChange={setSearch}
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      )}
      {isSearching && <p id="searching-indicator">Searching...</p>}
      {!isSearching && sortedTasks.length === 0 && (
        <p id="filter-empty-message">
          {debouncedSearch.trim() ? `No tasks found for "${debouncedSearch.trim()}"` : 'No tasks match this filter'}
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

export default function TaskApp(props: TaskAppProps) {
  return (
    <ThemeProvider>
      <TaskAppInner {...props} />
    </ThemeProvider>
  )
}