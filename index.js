const express = require('express')
var morgan = require('morgan')
const app = express()

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

app.use(express.json());
app.use(morgan('tiny'));

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === Number(request.params.id));
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== Number(request.params.id));
  response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
  const body = request.body;

  // 名称缺失
  if (!body.name) {
    return response.status(400).json({
      error: '名称缺失'
    })
  }

  // 名字重复
  const name = body.name;
  const found = persons.find(person => person.name === name);
  if (found) {
    return response.status(400).json({
      error: '姓名已存在'
    })
  }

  // 号码缺失
  if (!body.number) {
    return response.status(400).json({
      error: '号码缺失'
    })
  }

  const newPerson = {
    ...body,
    id: Math.floor(Math.random() * 1000000)
  }

  persons = persons.concat(newPerson);
  response.json(newPerson);
})

app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${persons.length} people <br />
    ${new Date()}
  `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})