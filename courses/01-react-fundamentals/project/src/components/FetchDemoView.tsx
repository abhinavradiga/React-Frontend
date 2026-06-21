import { useState, useEffect } from 'react'

interface TodoItem {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/todos.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch todos')
        return res.json()
      })
      .then((data: TodoItem[]) => {
        if (!cancelled) {
          setItems(data)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <div id="fetch-loading">Loading...</div>
  }

  if (error) {
    return <div id="fetch-error">{error}</div>
  }

  return (
    <ul id="fetch-list">
      {items.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}