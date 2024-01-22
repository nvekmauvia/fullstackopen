const Persons = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map(person =>
        <Person key={person.id} person={person} />
      )}
    </div>
  )
}

const Person = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

export default Persons