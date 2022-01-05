const { response } = require('express')
const express = require('express')
const app = express()

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
  console.log(persons)
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)

    person
      ? res.json(person)
      : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`Phonebook contains info for ${persons.length} people. Time: ${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})