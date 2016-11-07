const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const submissionRouteInit = require('./routes/submissions.js')

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(bodyParser.text())

submissionRouteInit(app)

app.use(express.static(__dirname + '/public'))

app.listen(50000)
console.log("Server listening at http://localhost:50000/")
