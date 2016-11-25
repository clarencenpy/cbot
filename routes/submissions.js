const Submission = require('../models/submission.js')
const AuthMiddleware = require('../AuthMiddleware.js')

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

const putSubmission = (req, res) => {
  Submission(Object.assign({}, req.body, {
    userId: req.params.userId,
    taskId: req.params.taskId
  })).save(err => {
    if (err && err.code === 11000) {
      //11000 is the error code that the mongo driver returns
      //when there is a duplicate key
      res.status(403).send('Already Exists')
    } else {
      res.status(201).send()
    }
  })
}

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

const init = (app) => {
  app.get('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, getSubmission)
  app.get('/submissions/byUser/:userId', AuthMiddleware.isLoggedIn, getAllSubmissionsByUser)
  app.get('/submissions/byTask/:taskId', AuthMiddleware.isLoggedIn, getAllSubmissionsByTask)
  app.put('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, putSubmission)
  app.post('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, postSubmission)
  app.delete('/submission/:userId/:taskId', AuthMiddleware.isLoggedIn, deleteSubmission)
}

module.exports = {init}