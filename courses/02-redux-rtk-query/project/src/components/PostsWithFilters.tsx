import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSearchTerm, setSortBy } from '../store/slices/filtersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsWithFilters() {
  const dispatch = useAppDispatch()
  const { searchTerm, sortBy } = useAppSelector(state => state.filters)
  const { data: posts, isLoading } = useGetPostsQuery()

  const filtered = posts
    ? [...posts]
        .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortBy === 'title' ? a.title.localeCompare(b.title) : a.id - b.id)
    : []

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={e => dispatch(setSearchTerm(e.target.value))}
        />
        <select value={sortBy} onChange={e => dispatch(setSortBy(e.target.value as 'title' | 'id'))}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {filtered.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}