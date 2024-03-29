import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={blogTitle}
            name="Title"
            onChange={({ target }) => setBlogTitle(target.value)}
            className='titleInputField'
            data-cy='titleInputField'
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
            className='authorInputField'
            data-cy='authorInputField'
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={blogUrl}
            name="Author"
            onChange={({ target }) => setBlogUrl(target.value)}
            className='urlInputField'
            data-cy='urlInputField'
          />
        </div>
        <button
          type="submit"
          className='createNewBlogButton'
          data-cy='createBlogButton'
        >create</button>
      </form>
    </div>
  )
}

export default BlogForm