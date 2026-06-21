import { useState, useEffect } from 'react'

function readValue<T>(key: string, initialValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return initialValue
    return JSON.parse(stored) as T
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore storage errors
    }
  }, [key, value])

  function setStoredValue(newValue: T | ((prev: T) => T)) {
    setValue(prev => {
      const resolved = newValue instanceof Function ? newValue(prev) : newValue
      return resolved
    })
  }

  return [value, setStoredValue]
}