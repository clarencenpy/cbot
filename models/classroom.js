const mongoose = require('mongoose')
const classroomSchema = new mongoose.Schema({
  createdBy: String,
  name: String,
  password: String,
  students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  tasks: [Object],
  classEnded: Boolean
})

module.exports = mongoose.model('Classroom', classroomSchema)