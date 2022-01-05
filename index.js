const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'missing name or number'
        })
    }

    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            reror: 'name already in phonebook'
        })
    }

    person.id = Math.floor(Math.random() * 10000)
    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
  res.send(`Phonebook contains info for ${persons.length} people. Time: ${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})