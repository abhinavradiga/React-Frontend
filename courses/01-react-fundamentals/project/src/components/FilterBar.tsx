import { useState } from 'react'

interface FilterBarProps {
  filter?: string
  activeFilter?: string
  onFilterChange?: (filter: string) => void
  onSearchChange?: (search: string) => void
  sortOrder?: string
  onSortChange?: (sort: string) => void
  searchValue?: string
}

export default function FilterBar({ filter, activeFilter, onFilterChange, onSearchChange, sortOrder, onSortChange, searchValue }: FilterBarProps) {
  const [internalSearch, setInternalSearch] = useState('')
  const current = filter ?? activeFilter ?? 'all'
  const search = searchValue ?? internalSearch

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInternalSearch(e.target.value)
    onSearchChange?.(e.target.value)
  }

  function handleClear() {
    setInternalSearch('')
    onSearchChange?.('')
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
      {search && (
        <button id="clear-search" onClick={handleClear}>Clear search</button>
      )}
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