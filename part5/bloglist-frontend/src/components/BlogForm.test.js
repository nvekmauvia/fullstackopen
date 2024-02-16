import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogform from './BlogForm'

describe('BlogForm', () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'TestUrl',
    likes: 500
  }
  const mockHandler = jest.fn()

  test('proper event handling', async () => {

    const container = render(
      <Blogform createBlog={mockHandler}/>
    ).container

    const user = userEvent.setup()

    const input = container.querySelector('.titleInputField')
    await user.type(input, 'Test Title!!')

    const button = container.querySelector('.createNewBlogButton')
    await user.click(button)

    console.log(mockHandler.mock.calls)
    expect(mockHandler.mock.calls[0][0].title).toBe('Test Title!!')
  })
})