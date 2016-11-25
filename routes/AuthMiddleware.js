const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(401).send()
  }
}

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next()
  } else {
    res.status(401).send()
  }
}

const isInstructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    next()
  } else {
    res.status(401).send()
  }
}

module.exports = {
  isLoggedIn,
  isStudent,
  isInstructor
}