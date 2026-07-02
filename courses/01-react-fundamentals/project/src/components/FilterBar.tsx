import { useState, useRef } from 'react'
import Button from './Button'

interface FilterBarProps {
  filter?: string
  activeFilter?: string
  onFilterChange?: (filter: string) => void
  onSearchChange?: (search: string) => void
  sortOrder?: string
  onSortChange?: (sort: string) => void
  searchValue?: string
  categories?: string[]
  categoryFilter?: string
  onCategoryChange?: (category: string) => void
}

export default function FilterBar({
  filter, activeFilter, onFilterChange, onSearchChange,
  sortOrder, onSortChange, searchValue,
  categories, categoryFilter, onCategoryChange,
}: FilterBarProps) {
  const [internalSearch, setInternalSearch] = useState('')
  const current = filter ?? activeFilter ?? 'all'
  const search = searchValue ?? internalSearch
  const searchInputRef = useRef<HTMLInputElement>(null)

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
        ref={searchInputRef}
        type="text"
        placeholder="Search tasks"
        value={search}
        onChange={handleSearch}
      />
      {search && (
        <Button id="clear-search" onClick={handleClear} variant="secondary">Clear search</Button>
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
          <option value="due-date">Due Date (Soonest First)</option>
        </select>
      )}
      {onCategoryChange && categories && (
        <select
          id="category-filter"
          value={categoryFilter ?? 'all'}
          onChange={e => onCategoryChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  )
}