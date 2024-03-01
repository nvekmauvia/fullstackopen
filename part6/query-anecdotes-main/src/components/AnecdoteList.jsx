import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote } from './requests'
import { useAnecdoteDispatch } from '../AnecdoteContext'

const AnecdoteList = ({ anecdotes }) => {
    const queryClient = useQueryClient()

    const dispatch = useAnecdoteDispatch()

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        },
    })

    const handleVote = (anecdote) => {
        dispatch({ type: 'SHOW_NOTIFICATION', payload: `voted: ${anecdote.content}` })
        setTimeout(() => {
            dispatch({ type: 'CLEAR_NOTIFICATION' })
        }, 5000)
        updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
