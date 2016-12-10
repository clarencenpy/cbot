const Classroom = require('../models/classroom.js')
const AuthMiddleware = require('../AuthMiddleware.js')
const ObjectId = require('mongoose').Types.ObjectId

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
  })).save((err, doc) => {
    if (err) throw err
    res.status(201).render('partials/classroomCard', {classroom: doc})
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

const addTask = (req, res) => {
  let task = req.body
  task._id = ObjectId()
  Classroom.findOneAndUpdate(req.params.classroomId, {
    $push: {tasks: task}
  }, (err, doc) => {
    if (err) throw err
    if (doc) {
      res.status(201).render('partials/taskCard', {task})
    } else {
      res.status(404).send()
    }
  })
}

const init = (app) => {
  app.get('/classroom/:_id', AuthMiddleware.isLoggedIn, getClassroom)
  app.get('/classrooms', AuthMiddleware.isLoggedIn, getAllClassrooms)
  app.get('/classrooms/:createdBy', AuthMiddleware.isLoggedIn, getAllClassroomsByUser)
  app.put('/classroom', AuthMiddleware.isInstructor, putClassroom)
  app.post('/classroom/:_id', AuthMiddleware.isInstructor, postClassroom)
  app.delete('/classroom/:_id', AuthMiddleware.isInstructor, deleteClassroom)

  app.put('/classroom/:classroomId/task', AuthMiddleware.isInstructor, addTask)
}

module.exports = {init}