// useQueryHook: useGetUsersQuery from RTK Query
import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data: users, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-list"><p data-testid="users-loading">Loading...</p></div>
  }

  if (isError) {
    return (
      <div data-testid="users-list">
        <ErrorDisplay message={String(error)} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div data-testid="users-list">
      <h3>Users</h3>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}