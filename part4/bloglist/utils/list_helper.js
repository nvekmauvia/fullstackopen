const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum += blog.likes
    })

    return sum
}

const favouriteBlog = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    let favBlog = blogs[0]
    let highestLikes = favBlog.likes
    blogs.forEach(blog => {
        if (blog.likes > highestLikes) {
            highestLikes = blog.likes
            favBlog = blog
        }
    })
    return favBlog
}

const mostBlogs = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    const blogsByAuthor = _.groupBy(blogs, 'author')

    const authorBlogCounts = _.map(blogsByAuthor, (blogs, author) => ({
        author, blogs: blogs.length
    }))

    const mostBlogsAuthor = _.maxBy(authorBlogCounts, 'blogs')

    return mostBlogsAuthor.author
}

const mostLikes = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    const blogsByAuthor = _.groupBy(blogs, 'author')

    const likesByAuthor = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author,
        likes: _.sumBy(authorBlogs, 'likes')
    }))

    const mostLikesAuthor = _.maxBy(likesByAuthor, 'likes')

    return mostLikesAuthor
}



module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}