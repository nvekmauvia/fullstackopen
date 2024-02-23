import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState('error')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(`${username} Logged in`)
      setMessageStyle('message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setMessageStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setMessageStyle('message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong format')
      setMessageStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject)
    } catch (exception) {
      setErrorMessage('Update failed')
      setMessageStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteObj(blogObject)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      setErrorMessage(`${blogObject.title} by ${blogObject.author} deleted`)
      setMessageStyle('message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('deletion failed')
      setMessageStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className={messageStyle}>
        {message}
      </div>
    )
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          data-cy="usernameInput"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          data-cy="passwordInput"
        />
      </div>
      <button
        type="submit"
        data-cy="loginButton"
      >login</button>
    </form>
  )

  const blogsForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && <div>
        {user.name} logged in <button onClickCapture={handleLogout}>logout</button>
        {blogsForm()}
      </div>}
      <br />
      <h2>blog list</h2>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog, index) =>
          <div key={blog.id} data-cy={`blog-${index}`}>
            <Blog
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              currentUsername={user ? user.username : ''}
            />
          </div>
        )}
    </div>
  )
}

export default App