import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void
  editingId?: string | number | null
  onStartEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  linkToTaskDetail?: boolean
}

const hardcodedTasks: Task[] = [
  { id: 1, title: 'Task One', description: 'First hardcoded task', priority: 'Priority: High', completed: false },
  { id: 2, title: 'Task Two', description: 'Second hardcoded task', priority: 'Priority: Medium', completed: false },
  { id: 3, title: 'Task Three', description: 'Third hardcoded task', priority: 'Priority: Low', completed: false },
]

export default function TaskList({ tasks, countText, onToggle, onDelete, onUpdateTask, editingId, onStartEdit, onCancelEdit }: TaskListProps) {
  const displayTasks = tasks !== undefined ? tasks : hardcodedTasks

  return (
    <section id="task-list">
      {countText && <p id="task-count">{countText}</p>}
      {displayTasks.map(task => (
        <TaskCard
          key={task.id}
          taskId={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category}
          tags={task.tags}
          dueDate={task.dueDate}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          isEditing={editingId === task.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </section>
  )
}