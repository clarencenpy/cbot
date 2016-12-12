const Submission = require('../models/submission.js')
const Classroom = require('../models/classroom.js')
const AuthMiddleware = require('../AuthMiddleware.js')

const async = require('asyncawait').async
const await = require('asyncawait').await

const getSubmission = (req, res) => {
  Submission.findOne({userId: req.params.userId, taskId: req.params.taskId}, (err, submission) => {
    if (submission) {
      res.send(submission)
    } else {
      res.status(404).send()
    }
  })
}

const getAllSubmissionsByUser = (req, res) => {
  Submission.find({userId: req.params.userId}, (err, submissions) => {
    if (err) throw err
    res.send(submissions)
  })
}

const getAllSubmissionsByTask = (req, res) => {
  Submission.find({taskId: req.params.taskId}, (err, submissions) => {
    if (err) throw err
    res.send(submissions)
  })
}

const putSubmission = async((io, req, res) => {
  let classroom = await(Classroom.findOne({tasks: {$elemMatch: {_id: req.params.taskId}}}))
  Submission.findOneAndUpdate(
      {userId: req.user._id, taskId: req.params.taskId},
      {htmlCode: req.body.htmlCode, jsCode: req.body.jsCode},
      {upsert: true},
      (err, doc) => {
        if (err) throw error
        io.sockets.emit('submissionReceived', {classroomId: classroom._id})
        res.send()
      }
  )
})

const postSubmission = (req, res) => {
  Submission.findOneAndUpdate(
      {taskId: req.params.taskId, userId: req.params.userId},
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

const deleteSubmission = (req, res) => {
  Submission.findOneAndRemove(
      {taskId: req.params.taskId, userId: req.params.userId},
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

const init = (app, io) => {
  app.get('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, getSubmission)
  app.get('/submissions/byUser/:userId', AuthMiddleware.isLoggedIn, getAllSubmissionsByUser)
  app.get('/submissions/byTask/:taskId', AuthMiddleware.isLoggedIn, getAllSubmissionsByTask)
  app.put('/submission/:taskId', AuthMiddleware.isLoggedIn, putSubmission.bind(null, io))
  app.post('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, postSubmission)
  app.delete('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, deleteSubmission)
}

module.exports = {init}