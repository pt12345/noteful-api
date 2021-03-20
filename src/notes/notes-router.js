const path = require('path')
const express = require('express')
//const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNotes = note => ({
    id: String(note.id),
    name: note.name,
    modified: note.modified,
    folderId: String(note.folderid),
    content: note.content
  })

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
          .then(notes => {
            res.json(notes.map(serializeNotes))
          })
          .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { name, content } = req.body
      const newNote = { name, content }
      newNote.folderid = req.body.folderId
      console.log(req.body)
  
    NotesService.addNote(
        req.app.get('db'),
        newNote
      )
        .then(folder => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${folder.id}`))
            .json(serializeNotes(folder))
        })
        .catch(next)
    })

notesRouter
    .route('/:note_id')
    .delete((req, res, next) => {
        console.log(req.params.folder_Id)
        NotesService.deleteNote(
          req.app.get('db'),
          req.params.note_id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })
module.exports = notesRouter