const Classroom = require('../models/classroom.js')
const Submission = require('../models/submission.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const async = require('asyncawait').async
const await = require('asyncawait').await

const init = (app) => {
  app.get('/student/classroom/:id', AuthMiddleware.isStudent, async((req, res) => {
    let classroom = await(Classroom.findById(req.params.id))
    classroom.tasks = classroom.tasks.map(task => {
      let s = await(Submission.findOne({userId: req.user._id, taskId: task.id}))
      if (s) task.done = true
      return task
    })
    res.render('studentClassroom', {user: req.user, classroom})
  }))

  app.get('/boilerplate/:taskId', AuthMiddleware.isStudent, async((req, res) => {
    let submission = await(Submission.findOne({userId: req.user._id, taskId: req.params.taskId}))
    if (submission) {
      res.send({
        htmlCode: submission.htmlCode,
        jsCode: submission.jsCode
      })
    } else {
      //get the defaults from the task
      let classroom = await(Classroom.findOne({tasks: {$elemMatch: {_id: req.params.taskId}}}))
      for (let task of classroom.tasks) {
        if (task._id.valueOf().toString() === req.params.taskId) {
          res.send({
            htmlCode: task.htmlCode,
            jsCode: task.jsCode
          })
          return
        }
      }
    }
  }))

  app.get('/taskCard/:taskId', AuthMiddleware.isStudent, async((req, res) => {
    //get the defaults from the task
    let classroom = await(Classroom.findOne({tasks: {$elemMatch: {_id: req.params.taskId}}}))
    for (let task of classroom.tasks) {
      if (task._id.valueOf().toString() === req.params.taskId) {
        res.render('partials/taskCard', {user: req.user, task})
        return
      }
    }
  }))
}

module.exports = {init}