require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const currDate = new Date
    response.send(
        `
        <p>Phonebook has info for ${personsCount} people</p>
        <p>${currDate} </p>
        `
    )
})


app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/people/:id', (request, response) => {
    /*
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }*/
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/people', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    /*
    if (people.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }*/
    if (body.number === undefined) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', function () {
    console.log(`Server running on port ${PORT}`)
})