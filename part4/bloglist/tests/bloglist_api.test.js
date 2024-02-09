const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
require('dotenv').config()

let loginToken = ""
const testUserName = "testUser"
const testUserPw = process.env.SECRET

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects
        .map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})
    const newUser = {
        username: testUserName,
        name: "Kevin Chen",
        password: testUserPw
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const login = {
        username: testUserName,
        password: testUserPw
    }
    const loginResponse = await api
        .post('/api/login')
        .send(login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    loginToken = loginResponse.body.token

    const newBlog = {
        title: 'TestBlog',
        author: 'Edsger W. Dijkstra',
        url: 'https://www.gotquestions.org/Jesus-greater.html',
        likes: 50,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(newBlog)
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
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
            url: 'https://www.gotquestions.org/Jesus-greater.html',
            likes: 50,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

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
            .set('Authorization', `Bearer ${loginToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBeDefined()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })

    test('no url gives 400 bad request', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginToken}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    })

    test('no token = 401 unauthorized', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: 'Jesus is great',
            author: 'Edsger W. Dijkstra',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    })
})

describe('deletion', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${loginToken}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

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
            .set('Authorization', `Bearer ${loginToken}`)
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
            .set('Authorization', `Bearer ${loginToken}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const testedBlog = blogsAtEnd.find(blog => blog.title === updatedBlog.title)
        expect(testedBlog.likes).toBe(newBlog.likes + 1)
    })
})


describe('user creation', () => {
    test('can add new username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "poppy2",
            name: "Kevin Chen",
            password: "awfawawgf"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    })

    test('fails with 400 if not unique username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: testUserName,
            name: "Kevin Chen",
            password: testUserPw
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with 400 if password doesnt exist', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "poppssdwy",
            name: "Kevin Chen"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('fails with 400 if username too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "p",
            name: "Kevin Chen",
            password: "password"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
    test('fails with 400 if password too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "poppssfwssdwy",
            name: "Kevin Chen",
            password: "p"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})
