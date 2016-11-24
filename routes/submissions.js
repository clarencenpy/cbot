const Submission = require('../models/submission.js')

const getSubmission = (req, res) => {
  Submission.findOne({userId: req.params.userId, taskId: req.params.taskId}, (err, submission) => {
    console.log(submission)
    if (submission) {
      res.send({status: 'success', data: submission})
    } else {
      res.send({status: 'failed, does not exist'})
    }
  })
}

const getAllSubmissions = (req, res) => {
  Submission.find({}, (err, submissions) => {
    res.render('submissionsTable', {submissions})
  })
}

const putSubmission = (req, res) => {
  Submission({
    userId: req.params.userId,
    taskId: req.params.taskId,
    code: req.body,
    passed: false
  }).save(err => {
    if (err) throw err
    res.send({
      status: 'success', data: {
        userId: req.params.userId,
        taskId: req.params.taskId,
        code: req.body
      }
    })
  })
}

const postSubmission = (req, res) => {
  Submission.findOneAndUpdate(
      {taskId: req.params.taskId, userId: req.params.userId},
      {code: req.body},
      (err, doc) => {
        if (err) throw err
        if (doc) {
          res.send(doc)
        } else {
          res.send({status: 'failed, does not exist'})
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
          res.send({status: 'delete success'})
        } else {
          res.send({status: 'failed, does not exist'})
        }
      }
  )
}

const init = (app) => {
  app.get('/submission/:userId/:taskId', getSubmission)
  app.get('/submissions', getAllSubmissions)
  app.put('/submission/:userId/:taskId', putSubmission)
  app.post('/submission/:userId/:taskId', postSubmission)
  app.delete('/submission/:userId/:taskId', deleteSubmission)
}

module.exports = {init}