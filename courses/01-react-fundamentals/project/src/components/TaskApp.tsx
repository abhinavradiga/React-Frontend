import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'

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

export default function TaskApp({ tasks, countFormat, onDelete, showFilterBar: _sf, showStatsPanel: _ss, showForm: _form, setTasks: _st, dispatch: _d, linkToTaskDetail: _ltd }: TaskAppProps) {
  const displayTasks = tasks ?? DEFAULT_TASKS
  const countText = `${displayTasks.length} ${countFormat === 'tasks' ? 'Tasks' : 'Tasks'}`

  return (
    <div id="task-app">
      <TaskList
        tasks={displayTasks}
        countText={countText}
        onDelete={onDelete}
      />
    </div>
  )
}