import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let container

  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'TestUrl',
    likes: 500
  }
  const mockHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} updateBlog={mockHandler} deleteBlog={mockHandler} currentUsername={''} />
    ).container
  })

  test('renders content', () => {
    const titleElement = screen.queryByText('TestTitle', { exact: false })
    const authorElement = screen.queryByText('TestAuthor', { exact: false })
    const urlElement = screen.queryByText('TestUrl', { exact: false })
    const likesElement = screen.queryByText(/500/, { exact: false })

    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()
    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })

  test('renders contents after clicking', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.blogToggleButton')
    await user.click(button)

    const titleElement = screen.queryByText('TestTitle', { exact: false })
    const authorElement = screen.queryByText('TestAuthor', { exact: false })
    const urlElement = screen.queryByText('TestUrl', { exact: false })
    const likesElement = screen.queryByText(/500/, { exact: false })

    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()
    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })

  test('like button works', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.blogToggleButton')
    await user.click(button)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})