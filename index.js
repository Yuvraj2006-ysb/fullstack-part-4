require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

const requestLogger = (request,response,next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ',request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/notes', (_request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  })

app.post('/api/notes', (request, response) => {
  const body = request.body

  if(! body.content) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = new Note ({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id).then(note => {
    if (!note) {
      return response.status(400).end()
    }

    note.content = content
    note.important = important

    return note.save().then((updatedNote) => {
      response.json(updatedNote)
    })
  })
  .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

const unknownEndpoint = (request, response)
const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
