import { createContext, useReducer, useContext } from 'react'

const anecdoteReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return null;
        default:
            return state
    }
}

const AnecdoteContext = createContext()

export const AnecdoteContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(anecdoteReducer, null)

    return (
        <AnecdoteContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </AnecdoteContext.Provider>
    )
}

export const useAnecdoteValue = () => {
    const notificationAndDispatch = useContext(AnecdoteContext)
    return notificationAndDispatch[0]
}

export const useAnecdoteDispatch = () => {
    const notificationAndDispatch = useContext(AnecdoteContext)
    return notificationAndDispatch[1]
}


export default AnecdoteContext