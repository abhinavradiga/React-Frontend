import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery()

  if (isLoading) return <div data-testid="posts-list"><p>Loading posts...</p></div>
  if (isError) return <div data-testid="posts-list"><p>Error loading posts. <button onClick={refetch}>Retry</button></p></div>

  return (
    <div data-testid="posts-list">
      <h3>Posts</h3>
      <ul>
        {posts?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}