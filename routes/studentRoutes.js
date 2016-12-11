const Classroom = require('../models/classroom.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const async = require('asyncawait').async
const await = require('asyncawait').await

const init = (app) => {
  app.get('/student/classroom/:id', AuthMiddleware.isStudent, async((req, res) => {
    Classroom.findById(req.params.id)
    .exec((err, classroom) => {
      res.render('studentClassroom', {user: req.user, classroom})
    })
  }))
}

module.exports = {init}