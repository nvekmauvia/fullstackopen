const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)


const note = new Note({
    content: 'HTML is Easy',
    important: true,
})

const note2 = new Note({
    content: 'HTML is Hard',
    important: true,
})

//note2.save()
note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})

/*
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/