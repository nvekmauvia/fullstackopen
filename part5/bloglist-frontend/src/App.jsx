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

  const addBlog = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      blogService
        .create(blogObject)
        .then(responseData => {
          setBlogs(blogs.concat(responseData))
          setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
          setMessageStyle('message')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } catch (exception) {
      setErrorMessage('Wrong format')
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
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App