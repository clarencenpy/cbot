const Classroom = require('../models/classroom.js')
const User = require('../models/user.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const init = (app) => {
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
}

module.exports = {init}