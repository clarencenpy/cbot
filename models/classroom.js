const mongoose = require('mongoose')
const classroomSchema = new mongoose.Schema({
  createdBy: String,
  name: String,
  students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  expectedAttendance: Number,
  tasks: [{
    name: String,
    description: String,
    htmlCode: String,
    jsCode: String
  }],
})

module.exports = mongoose.model('Classroom', classroomSchema)