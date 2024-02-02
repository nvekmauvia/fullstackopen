const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url =
    `mongodb+srv://nvekmauvia:${password}@cluster0.x3dcbks.mongodb.net/phonebook?retryWrites=true&w=majority`

if (process.argv.length === 3) {
  mongoose.set('strictQuery', false)
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Persons', personSchema)

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}
else {
  if (process.argv.length < 5) {
    console.log('give password person number as argument')
    process.exit(1)
  }

  const nameEntry = process.argv[3]
  const numberEntry = process.argv[4]

  mongoose.set('strictQuery', false)
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Persons', personSchema)

  const person = new Person({
    name: nameEntry,
    number: numberEntry,
  })

  person.save().then(() => {
    console.log(`added ${nameEntry} number ${numberEntry} to phonebook`)
    mongoose.connection.close()
  })
}