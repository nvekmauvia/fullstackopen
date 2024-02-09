const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user.id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: 'blog post not found' });
    }

    const userId = user.id.toString()
    const blogUserId = blog.user.toString();

    if (userId === blogUserId) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    else {
        return response.status(401).json({ error: 'wrong user' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})


module.exports = blogsRouter