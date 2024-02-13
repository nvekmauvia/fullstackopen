import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUserId: currentUsername }) => {
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

  console.log(workingBlog.user)
  console.log(currentUsername)

  return (
    <div style={blogStyle}>
      < div  >
        {workingBlog.title} {workingBlog.author}
        <button onClick={() => setVisibility(!visibility)} >view</button>
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
        <button onClick={increaseLike}>like</button>
        <br />
        {workingBlog.user && workingBlog.user.username == currentUsername &&
          <button onClick={deleteSelf}>delete</button>
        }
      </div>
      }
    </div>
  )
}

export default Blog