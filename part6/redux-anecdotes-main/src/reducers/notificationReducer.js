import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

let timeoutId = null

export const postNotificationAndClear = createAsyncThunk(
    'notification/postAndClear',
    async (content, { dispatch }) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
            timeoutId = null
        }

        dispatch(editNotification(content))

        timeoutId = setTimeout(() => {
            dispatch(clearNotification())
            timeoutId = null
        }, 5000)
    }
)

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        editNotification(state, action) {
            const content = action.payload
            return content
        },
        clearNotification() {
            return null
        },
    },
})

export const { editNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
