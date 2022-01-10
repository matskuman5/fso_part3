const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.gkc9j.mongodb.net/phonebook?retryWrites=true&w=majority`

if (process.argv.length == 4 || process.argv.length > 5) {
    console.log('error: wrong amount of arguments')
    return
}

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({}).then(res => {
        res.forEach(p => {
            console.log(p)
        })
        mongoose.connection.close()
    })
    return
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(res => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
})



