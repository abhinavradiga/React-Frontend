import { useState } from 'react'

interface FilterBarProps {
  filter?: string
  activeFilter?: string
  onFilterChange?: (filter: string) => void
  onSearchChange?: (search: string) => void
  sortOrder?: string
  onSortChange?: (sort: string) => void
}

export default function FilterBar({ filter, activeFilter, onFilterChange, onSearchChange, sortOrder, onSortChange }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const current = filter ?? activeFilter ?? 'all'

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    onSearchChange?.(e.target.value)
  }

  return (
    <div id="filter-bar">
      <input
        id="search-input"
        type="text"
        placeholder="Search tasks"
        value={search}
        onChange={handleSearch}
      />
      <button onClick={() => onFilterChange?.('all')} data-active={current === 'all' ? 'true' : 'false'}>All</button>
      <button onClick={() => onFilterChange?.('active')} data-active={current === 'active' ? 'true' : 'false'}>Active</button>
      <button onClick={() => onFilterChange?.('completed')} data-active={current === 'completed' ? 'true' : 'false'}>Completed</button>
      {onSortChange && (
        <select
          id="sort-order"
          value={sortOrder ?? 'recent'}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="priority-high">Priority: High to Low</option>
          <option value="priority-low">Priority: Low to High</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      )}
    </div>
  )
}