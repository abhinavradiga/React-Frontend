import { useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading }] = useAddPostMutation()

  async function handleSubmit() {
    if (!title.trim()) return
    await addPost({ title: title.trim(), body: body.trim(), userId: 1 })
    setTitle('')
    setBody('')
  }

  return (
    <div data-testid="add-post-form">
      <h3>Add Post</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <button
        data-testid="add-post-submit"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
    </div>
  )
}