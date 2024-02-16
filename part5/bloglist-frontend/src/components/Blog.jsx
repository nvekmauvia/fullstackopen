import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, currentUsername }) => {
  const [workingBlog, setWorkingBlog] = useState(blog)
  const [visibility, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const increaseLike = () => {
    const updatingBlog = ({
      ...workingBlog,
      likes: workingBlog.likes + 1
    })
    updateBlog(updatingBlog)
    setWorkingBlog(updatingBlog)
  }

  const deleteSelf = () => {
    if (window.confirm(`Delete ${workingBlog.title} by ${workingBlog.author}?`)) {
      deleteBlog(workingBlog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      < div  >
        {workingBlog.title} {workingBlog.author}
        <button onClick={() => setVisibility(!visibility)} className='blogToggleButton'>view</button>
      </div >
      {visibility && <div>
        {workingBlog.url}
        <br />
        likes {workingBlog.likes}
        <br />
        {workingBlog.user && <div>
          user {workingBlog.user.name}
        </div>
        }
        <button onClick={increaseLike} className='likeButton'>like</button>
        <br />
        {workingBlog.user && workingBlog.user.username === currentUsername &&
          <button onClick={deleteSelf}>delete</button>
        }
      </div>
      }
    </div>
  )
}

Blog.prototype = {
  blog:PropTypes.func.isRequired,
  updateBlog:PropTypes.func.isRequired,
  deleteBlog:PropTypes.func.isRequired,
  currentUsername:PropTypes.func.isRequired
}

export default Blog