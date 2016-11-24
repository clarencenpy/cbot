const mongoose = require('mongoose')
const submissionSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  fiddleUrl: String,
  passed: Boolean,
  code: String
})

submissionSchema.methods.togglePass = function (cb) {
  console.log(this)
}

module.exports = mongoose.model('Submission', submissionSchema)