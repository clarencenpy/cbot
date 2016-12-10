const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/')
  }
}

const isStudent = (req, res, next) => {
  return next()
  if (req.user && req.user.role === 'Student') {
    next()
  } else {
    res.redirect('/')
  }
}

const isInstructor = (req, res, next) => {
  return next()
  if (req.user && req.user.role === 'Instructor') {
    next()
  } else {
    res.redirect('/')
  }
}

module.exports = {
  isLoggedIn,
  isStudent,
  isInstructor
}