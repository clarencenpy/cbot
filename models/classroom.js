const mongoose = require('mongoose')
const classroomSchema = new mongoose.Schema({
  createdBy: String,
  name: String,
  password: String,
  students: [String],
  tasks: [String],
  classEnded: Boolean
})

module.exports = mongoose.model('Classroom', classroomSchema)