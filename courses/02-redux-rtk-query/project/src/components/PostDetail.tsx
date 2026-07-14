import { useState } from 'react'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const [postId, setPostId] = useState<number | undefined>(1)
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId as number, { skip: !postId })

  return (
    <div data-testid="post-detail">
      <div>
        <label>Post ID: </label>
        <select value={postId} onChange={e => setPostId(Number(e.target.value))}>
          {[1, 2, 3].map(id => (
            <option key={id} value={id}>Post {id}</option>
          ))}
        </select>
      </div>
      {isLoading && <p data-testid="post-detail-loading">Loading post...</p>}
      {isError && <p data-testid="post-detail-error">Error loading post.</p>}
      {post && (
        <div>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      )}
    </div>
  )
}