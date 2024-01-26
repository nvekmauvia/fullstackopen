const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <div>
      {filteredPersons.map(person =>
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      )}
    </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>{person.name} {person.number}
      <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
    </div>
  )
}

export default Persons