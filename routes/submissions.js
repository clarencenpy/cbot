const s = require('../models/submission.js')

const getSubmission = (req, res) => {
  let submission = s.findSubmission(req.params.userId, req.params.taskId)
  if (submission) {
    res.send({status: 'success', data: submission})
  } else {
    res.send({status: 'failed, does not exist'})
  }
}

const getAllSubmissions = (req, res) => {
  res.send(s.getAllSubmissions())
}

const putSubmission = (req, res) => {
  let added = s.addSubmission(req.params.userId, req.params.taskId, req.body)
  if (added) {
    res.send({
      status: 'success', data: {
        userId: req.params.userId,
        taskId: req.params.taskId,
        code: req.body
      }
    })
  } else {
    res.send({status: 'failed, already exists'})
  }
}

const postSubmission = (req, res) => {
  const updated = s.updateSubmission(req.params.userId, req.params.taskId, req.body)
  if (updated) {
    res.send({
      status: 'success', data: {
        userId: req.params.userId,
        taskId: req.params.taskId,
        code: req.body
      }
    })
  } else {
    res.send({status: 'failed, does not exist'})
  }
}

const deleteSubmission = (req, res) => {
  const deleted = s.deleteSubmission(req.params.userId, req.params.taskId)
  if (deleted) {
    res.send({status: 'success'})
  } else {
    res.send({status: 'failed, does not exist'})
  }
}

const init = (app) => {
  app.get('/submission/:userId/:taskId', getSubmission)
  app.get('/submissions', getAllSubmissions)
  app.put('/submission/:userId/:taskId', putSubmission)
  app.post('/submission/:userId/:taskId', postSubmission)
  app.delete('/submission/:userId/:taskId', deleteSubmission)
}

module.exports = init