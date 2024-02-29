import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const sortedAnecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

    let filteredAnecdotes = []
    if (sortedAnecdotes !== null) {
        filteredAnecdotes = sortedAnecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
    }

    return (
        <div>
            {filteredAnecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => {
                        dispatch(voteAnecdote(anecdote.id))
                        dispatch(setNotification(`voted: ${anecdote.content}`))
                    }}
                />
            )}
        </div>
    )
}

export default AnecdoteList