const Classroom = require('../models/classroom.js')
const User = require('../models/user.js')
const Submission = require('../models/submission.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const async = require('asyncawait').async
const await = require('asyncawait').await

const init = (app, io) => {
  app.get('/instructor/classroom/:id', AuthMiddleware.isInstructor, (req, res) => {
    Classroom.findById(req.params.id)
    .populate('students', 'firstName lastName displayPhoto')
    .exec((err, classroom) => {
      res.render('instructorClassroom', {user: req.user, classroom})
    })
  })

  app.get('/studentCard/:id', AuthMiddleware.isInstructor, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err
      res.render('partials/studentCard', {student: user})
    })
  })

  app.get('/instructor/viewer/:classroomId/:studentId', async((req, res) => {
    let classroom = await(Classroom.findById(req.params.classroomId, '_id name tasks'))
    let student = await(User.findById(req.params.studentId, '_id firstName'))
    classroom.tasks.map(task => {
      let s = await(Submission.findOne({userId: req.params.studentId, taskId: task._id}))
      if (s) task.done = true
      return task
    })
    res.render('instructorViewer', {user: req.user, classroom, student})
  }))

  io.on('connection', (socket) => {
    socket.on('assign', async(data => {
      //route assign packet to everyone after adding the required data
      let ss = await(User.findById(data.sourceStudentId, '_id firstName displayPhoto'))
      let ts = await(User.findById(data.targetStudentId, '_id firstName displayPhoto'))

      socket.broadcast.emit('receivedAssignment', {
        sourceStudent: {
          id: ss._id.valueOf().toString(),
          firstName: ss.firstName,
          displayPhoto: ss.displayPhoto
        },
        targetStudent: {
          id: ts._id.valueOf().toString(),
          firstName: ts.firstName,
          displayPhoto: ts.displayPhoto
        }
      })
    }))
  })

}

module.exports = {init}