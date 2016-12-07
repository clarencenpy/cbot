const Classroom = require('../models/classroom.js')

const init = (app) => {
  app.get('/instructor/classroom/:id', (req, res) => {
    Classroom.findById(req.params.id)
    .populate('students', 'firstName lastName displayPhoto')
    .exec((err, classroom) => {
      res.render('instructorClassroom', {user: req.user, classroom})
    })
  })
}

module.exports = {init}