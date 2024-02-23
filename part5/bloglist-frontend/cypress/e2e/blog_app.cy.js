describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    const user2 = {
      name: 'Otheruser',
      username: 'other',
      password: 'salainen'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.get('[data-cy="usernameInput"]')
    cy.get('[data-cy="passwordInput"]')
    cy.get('[data-cy="loginButton"]')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[data-cy="usernameInput"]').type('root')
      cy.get('[data-cy="passwordInput"]').type('salainen')
      cy.get('[data-cy="loginButton"]').click()

      cy.contains('root Logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('[data-cy="usernameInput"]').type('root')
      cy.get('[data-cy="passwordInput"]').type('badPassword')
      cy.get('[data-cy="loginButton"]').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'root Logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('[data-cy="titleInputField"]').type('test title')
      cy.get('[data-cy="authorInputField"]').type('test author')
      cy.get('[data-cy="urlInputField"]').type('www.test.com')
      cy.get('[data-cy="createBlogButton"]').click()
      cy.contains('a new blog test title by test author added')
    })

    it('A blog can be liked', function () {
      cy.createBlog({
        title: 'Meeee',
        author: '1234',
        url: 'test',
        likes: 0
      })

      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('Blog created by author can be deleted', function () {
      cy.createBlog({
        title: 'Meeee',
        author: '1234',
        url: 'test',
        likes: 0
      })

      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Meeee by 1234 deleted')
    })
  })

  describe('Only user can delete', function () {
    it('User cannot delete others blogs', function () {
      cy.login({ username: 'root', password: 'salainen' })
      cy.createBlog({
        title: 'Meeee',
        author: '1234',
        url: 'test',
        likes: 0
      })
      cy.login({ username: 'other', password: 'salainen' })
      cy.createBlog({
        title: 'MeeeeTooo',
        author: '1234',
        url: 'test',
        likes: 0
      })

      cy.get('[data-cy="blog-0"]').as('blog0')
      cy.get('@blog0').find('.blogToggleButton').click()
      cy.get('@blog0').should('not.contain', 'delete')

      cy.get('[data-cy="blog-1"]').as('blog1')
      cy.get('@blog1').find('.blogToggleButton').click()
      cy.get('@blog1').should('contain', 'delete')
    })
  })

  describe('Blogs are ordered by likes', function () {
    it('Most likes to least likes', function () {
      cy.login({ username: 'root', password: 'salainen' })
      cy.createBlog({
        title: 'Medium Likes',
        author: '1234',
        url: 'test',
        likes: 13
      })
      cy.createBlog({
        title: 'Least Likes',
        author: '1234',
        url: 'test',
        likes: 0
      })
      cy.createBlog({
        title: 'Most Likes',
        author: '1234',
        url: 'test',
        likes: 500
      })

      cy.get('[data-cy="blog-0"]').as('blog0')
      cy.get('@blog0').should('contain', 'Most Likes')

      cy.get('[data-cy="blog-1"]').as('blog1')
      cy.get('@blog1').should('contain', 'Medium Likes')

      cy.get('[data-cy="blog-2"]').as('blog2')
      cy.get('@blog2').should('contain', 'Least Likes')
    })
  })
})