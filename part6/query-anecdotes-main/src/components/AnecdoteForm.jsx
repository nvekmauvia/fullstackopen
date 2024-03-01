import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdotes } from './requests'
import { useAnecdoteDispatch } from '../AnecdoteContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const dispatch = useAnecdoteDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdotes,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      NotificationHandler(newAnecdote.content)
    },
    onError: () => {
      NotificationHandler('FAILURE')
    }
  })

  const NotificationHandler = async (content) => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: `${content}` })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
