const mongoose = require('mongoose')
const submissionSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  fiddleUrl: String,
  passed: Boolean,
  code: String
})

submissionSchema.index({taskId: 1, userId: 1}, {unique: true})

submissionSchema.statics.togglePass = function (userId, taskId, cb) {
  this.findOne({userId, taskId}, (err, submission) => {
    if (submission) {
      submission.passed = !submission.passed
      submission.save(cb)
    } else {
      cb(new Error("Not found"))
    }
  })
}

module.exports = mongoose.model('Submission', submissionSchema)