import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [message, setMessage] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(false)
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const hook = () => {
    personsService
      .getAll()
      .then(responseData => {
        setPersons(responseData)
      })
  }
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(e => e.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log(existingPerson)
        newPerson.id = existingPerson.id
        personsService
          .update(existingPerson.id, newPerson)
          .then(responseData => {
            setPersons(persons.map(currPerson => currPerson.id === existingPerson.id ? newPerson : currPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    }
    else {
      personsService
        .create(newPerson)
        .then(responseData => {
          setMessage(`Added ${newName}`)
          setMessageSuccess(true)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.concat(responseData))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .deleteObject(id)
        .catch(error => {
          setMessage(`${newName} was already deleted from the server`)
          setMessageSuccess(false)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  let filteredPersons = []
  if (persons !== null) {
    filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isSuccess={messageSuccess} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App