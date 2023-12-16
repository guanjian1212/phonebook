const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

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

app.use(cors());

app.use(express.json());

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

  // 号码缺失
  if (!body.number) {
    return response.status(400).json({
      error: '号码缺失'
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

  const newPerson = {
    ...body,
    id: Math.floor(Math.random() * 1000000)
  }

  persons = persons.concat(newPerson);
  response.json(newPerson);
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  // 号码缺失
  if (!body.number) {
    return response.status(400).json({
      error: '号码缺失'
    })
  }

  const name = body.name;
  persons = persons.map(person => {
    if (person.name !== name) {
      return person;
    } else {
      return {
        ...person,
        ...body
      }
    }
  })

  response.status(204).end();
})

app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${persons.length} people <br />
    ${new Date()}
  `)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})