import { configureStore } from '@reduxjs/toolkit'

import noteReducer from '../reducers/noteReducer'
import filterReducer, {filterChange} from '../reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

console.log(store.getState())
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('ALL'))

export default store