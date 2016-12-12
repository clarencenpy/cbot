const Classroom = require('../models/classroom.js')
const Submission = require('../models/submission.js')
const AuthMiddleware = require('../AuthMiddleware.js')
const ObjectId = require('mongoose').Types.ObjectId

const async = require('asyncawait').async
const await = require('asyncawait').await

const getClassroom = (req, res) => {
  Classroom.findById(req.params._id, (err, classroom) => {
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
  Classroom.findOneAndUpdate(req.params._id, {
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

const calculateProgressReport = async((req, res) => {
  let classroom = await(Classroom.findById(req.params._id))

  let taskReport = {}
  let studentReport = {}

  for (let task of classroom.tasks) {
    let taskProgress = []
    let submissions = await(Submission.find({taskId: task._id}))
    for (let s of submissions) {
      if (classroom.students.findIndex(studentId => {
            return studentId.valueOf().toString() === s.userId.valueOf().toString()
          }) !== -1) {
        taskProgress.push(s.userId)
      }
    }
    taskReport[task._id] = taskProgress //list of users that completed it
  }

  for (let studentId of classroom.students) {
    let studentProgress = []
    let submissions = await(Submission.find({userId: studentId}))
    for (let s of submissions) {
      if (classroom.tasks.findIndex(task => {
            return task._id.valueOf().toString() === s.taskId.valueOf().toString()
          }) !== -1) {
        studentProgress.push(s.taskId)
      }
    }
    studentReport[studentId] = studentProgress
  }

  res.send({
    taskReport,
    studentReport,
    totalStudents: classroom.expectedAttendance,
    totalTasks: classroom.tasks.length
  })

})

const studentProgress = async((req, res) => {
  let studentId = req.user._id
  let classrooms = await(Classroom.find({students: studentId}))
  let studentProgressByClassroom = {}
  for (let classroom of classrooms) {
    let totalSubmissions = 0
    for (let task of classroom.tasks) {
      let submission = await(Submission.findOne({taskId: task._id, userId: studentId}))
      if (submission) totalSubmissions++
    }
    studentProgressByClassroom[classroom._id] = {
      totalTasks: classroom.tasks.length,
      totalSubmissions
    }
  }

  res.send(studentProgressByClassroom)

})

const enterClassroom = async((io, req, res) => {
  let classroom = await(Classroom.findById(req.params._id))
  if (classroom.students.findIndex(studentId => {
        return studentId.valueOf().toString() === req.user._id.valueOf().toString()
      }) === -1) {
    //student not yet entered
    classroom.students.push(req.user._id)
    classroom.save()
    io.sockets.emit('enterClassroom', {classroomId: req.params._id, studentId: req.user._id})
  }
  res.send()
})

const leaveClassroom = async((io, req, res) => {
  let classroom = await(Classroom.findById(req.params._id))
  classroom.students = classroom.students.filter(studentId => {
    return studentId.valueOf().toString() !== req.user._id.valueOf().toString()
  })
  classroom.save()
  io.sockets.emit('leaveClassroom', {classroomId: req.params._id, studentId: req.user._id})
  res.send()
})

const init = (app, io) => {
  app.get('/classroom/progress', AuthMiddleware.isLoggedIn, studentProgress)

  app.get('/classroom/:_id', AuthMiddleware.isLoggedIn, getClassroom)
  app.get('/classrooms', AuthMiddleware.isLoggedIn, getAllClassrooms)
  app.get('/classrooms/:createdBy', AuthMiddleware.isLoggedIn, getAllClassroomsByUser)
  app.put('/classroom', AuthMiddleware.isInstructor, putClassroom)
  app.post('/classroom/:_id', AuthMiddleware.isInstructor, postClassroom)
  app.delete('/classroom/:_id', AuthMiddleware.isInstructor, deleteClassroom)

  app.put('/classroom/:_id/task', AuthMiddleware.isInstructor, addTask)
  app.get('/classroom/:_id/progress', AuthMiddleware.isInstructor, calculateProgressReport)
  app.post('/enterClassroom/:_id', AuthMiddleware.isStudent, enterClassroom.bind(null, io))
  app.post('/leaveClassroom/:_id', AuthMiddleware.isStudent, leaveClassroom.bind(null, io))
}

module.exports = {init}