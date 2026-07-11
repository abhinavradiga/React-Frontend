import { createSlice } from '@reduxjs/toolkit'

interface FiltersState {
  searchTerm: string
  sortBy: 'title' | 'id'
  sortOrder: 'asc' | 'desc'
}

const initialState: FiltersState = {
  searchTerm: '',
  sortBy: 'id',
  sortOrder: 'asc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
  },
})

export const { setSearchTerm, setSortBy, setSortOrder } = filtersSlice.actions
export default filtersSlice.reducer