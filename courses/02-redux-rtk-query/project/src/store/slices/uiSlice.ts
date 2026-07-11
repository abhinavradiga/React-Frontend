import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  isLoading: boolean
  notification: string | null
}

const initialState: UIState = {
  isLoading: false,
  notification: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    },
  },
})

export const { setLoading, setNotification, clearNotification } = uiSlice.actions
export default uiSlice.reducer