const Classroom = require('../models/classroom.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const getClassroom = (req, res) => {
  Classroom.findOneById(req.params._id, (err, classroom) => {
    if (classroom) {
      res.send(classroom)
    } else {
      res.status(404).send()
    }
  })
}

const getAllClassrooms = (req, res) => {
  Classroom.find({}, (err, classrooms) => {
    if (err) throw err
    res.send(classrooms)
  })
}

const getAllClassroomsByUser = (req, res) => {
  Classroom.find({createdBy: req.params.createdBy}, (err, classrooms) => {
    if (err) throw err
    res.send(classrooms)
  })
}

const putClassroom = (req, res) => {
  Classroom(Object.assign({}, req.body, {
    createdBy: process.env.NODE_ENV === 'development' ? 'ADMIN' : req.user.id
  })).save(err => {
    if (err) throw err
    res.status(201).send()
  })
}

const postClassroom = (req, res) => {
  Classroom.findByIdAndUpdate(req.params.id,
      req.body,
      (err, doc) => {
        if (err) throw err
        if (doc) {
          res.send()
        } else {
          res.status(404).send()
        }
      }
  )
}

const deleteClassroom = (req, res) => {
  Classroom.findByIdAndRemove(req.params.id,
      (err, doc) => {
        if (err) throw err
        if (doc) {
          res.send()
        } else {
          res.status(404).send()
        }
      }
  )
}

const init = (app) => {
  app.get('/classroom/:_id', AuthMiddleware.isLoggedIn, getClassroom)
  app.get('/classrooms', AuthMiddleware.isLoggedIn, getAllClassrooms)
  app.get('/classrooms/:createdBy', AuthMiddleware.isLoggedIn, getAllClassroomsByUser)
  app.put('/classroom', AuthMiddleware.isInstructor, putClassroom)
  app.post('/classroom/:_id', AuthMiddleware.isInstructor, postClassroom)
  app.delete('/classroom/:_id', AuthMiddleware.isInstructor, deleteClassroom)
}

module.exports = {init}