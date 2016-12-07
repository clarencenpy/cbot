const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Connecting to mongodb via mongoose
// mongoose manages the connection pool for us, and binds the connection to the model
const mongoose = require('mongoose')
let connectionString = 'mongodb://localhost:27017/cbot'
if (process.env.MLAB_PASSWORD && process.env.MLAB_USERNAME) {  //deployed
  connectionString = `mongodb://${process.env.MLAB_USERNAME}:${process.env.MLAB_PASSWORD}@ds159507.mlab.com:59507/cbot`
}
mongoose.connect(connectionString)
// ===========================================================================

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Middleware Setup
// app.use(morgan('tiny'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({secret: 'dingdong'}))
app.use(passport.initialize())
app.use(passport.session())

// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function (file) {
  // There might be non-js files in the directory that should not be loaded
  if (path.extname(file) === '.js') {
    console.log("Adding routes in " + file)
    require('./routes/' + file).init(app)
  }
})

const Classroom = require('./models/classroom.js')
app.get('/main', (req, res) => {
  //redirect to the correct page based on role
  if (!req.user) res.redirect('/')

  if (req.user.role === 'Student') {
    Classroom.find({}, (err, classrooms) => {
      res.render('studentHome', {user: req.user, classrooms})
    })
  } else if (req.user.role === 'Instructor') {
    Classroom.find({}, (err, classrooms) => {
      res.render('instructorHome', {user: req.user, classrooms})
    })
  } else {
    res.redirect('/')
  }
})

app.get('/', (req, res) => {
  res.render('splash') //contains the login button
})

// Handle static files
app.use(express.static(__dirname + '/public'))

const httpServer = require('http').createServer(app)

httpServer.listen(3000, () => {
  console.log("Server listening at http://localhost:3000/")
  if (process.env.NODE_ENV === 'development')
    fs.writeFileSync(__dirname + '/start.log', 'started') //this file is watched to trigger refresh
})
