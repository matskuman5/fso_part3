require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(morgan(
  (tokens, req, res) => {
    if (tokens.method(req, res) === 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
      ].join(' ')
    } else {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
      ].join(' ')
    }
  }
))

let persons = [
  {
      id: 1,
      name: 'abc',
      number: '123',
  },
  {
      id: 2,
      name: 'xyz',
      number: '45678'
  },
  {
      id: 3,
      name: 'fwfwfeafe',
      number: '513414'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Test</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(p => {
    res.json(p)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(p => {
      p
      ? res.json(p)
      : res.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(p => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const person = req.body

    /* if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'name already in phonebook'
        })
    } */

    const person_db = new Person({
      name: person.name,
      number: person.number,
    })

    person_db.save().then(savedPerson => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      res.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(p => {
      res.json(p)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(documents => {
    res.send(`Phonebook contains info for ${documents} people. Time: ${new Date()}`)
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})