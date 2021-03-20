const path = require('path')
const express = require('express')
//const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: String(folder.id),
    name: folder.name
  })

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
          .then(folders => {
            res.json(folders.map(serializeFolder))
          })
          .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newNote = { name }
    
        FoldersService.addFolder(
          req.app.get('db'),
          newNote
        )
          .then(folder => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${folder.id}`))
              .json(serializeFolder(folder))
          })
          .catch(next)
      })

foldersRouter
    .route('/:folder_id')
    .delete((req, res, next) => {
        console.log(req.params.folder_Id)
        FoldersService.deleteFolder(
          req.app.get('db'),
          req.params.folder_id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })


module.exports = foldersRouter