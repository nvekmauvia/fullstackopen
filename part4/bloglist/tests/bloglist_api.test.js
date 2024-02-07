const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects
        .map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('getting', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('identifier is named id', async () => {
        const response = await helper.blogsInDb()

        expect(response[0].id).toBeDefined()
    })
})

describe('posting', () => {

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
            url: 'https://www.gotquestions.org/Jesus-greater.html',
            likes: 50,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'Jesus is great'
        )
    })

    test('empty likes default to 0', async () => {
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
            url: 'https://www.gotquestions.org/Jesus-greater.html'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBeDefined()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })

    test('no url gives 400 bad request', async () => {
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
})

describe('deletion', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('update', () => {
    test('updating likes', async () => {
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
            url: 'https://www.gotquestions.org/Jesus-greater.html',
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        const updatingBlog = blogs.find(blog => blog.title === newBlog.title)

        const updatedBlog = {
            ...updatingBlog,
            likes: updatingBlog.likes + 1
        }

        await api
            .put(`/api/blogs/${updatingBlog.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const testedBlog = blogsAtEnd.find(blog => blog.title === updatedBlog.title)
        expect(testedBlog.likes).toBe(newBlog.likes + 1)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})
