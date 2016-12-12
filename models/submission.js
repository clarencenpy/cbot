const mongoose = require('mongoose')
const submissionSchema = new mongoose.Schema({
  classroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  taskId: String,
  htmlCode: String,
  jsCode: String
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