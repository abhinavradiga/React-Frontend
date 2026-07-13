import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'
import type { User, Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } }
        }
      },
      providesTags: ['User'],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getPosts()
          return { data }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } }
        }
      },
      providesTags: ['Post'],
    }),
    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        try {
          const data = await mockApi.getPostById(id)
          return { data }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } }
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (post) => {
        try {
          const data = await mockApi.createPost(post)
          return { data }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } }
        }
      },
      invalidatesTags: ['Post'],
      async onQueryStarted(post, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.push({ ...post, id: Date.now() })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = apiSlice