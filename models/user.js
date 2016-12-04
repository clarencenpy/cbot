const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  id: String,
  token: String,
  email: String,
  firstName: String,
  lastName: String,
  displayPhoto: String,
  role: String  //Student | Instructor
})
module.exports = mongoose.model('User', userSchema)