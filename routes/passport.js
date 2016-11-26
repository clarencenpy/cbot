const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

const init = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  const User = require('../models/user.js')
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? process.env.NOW_URL + '/auth/facebook/callback' : 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'name', 'email', 'picture.type(large)']
  }, (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({id: profile.id}, (err, user) => {
        if (err) return done(err)
        if (user) {
          //update profile
          User.findByIdAndUpdate(user.id, {
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayPhoto: profile.photos[0].value
          })
          return done(null, user)
        } else {
          let newUser = new User({
            id: profile.id,
            token: token,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayPhoto: profile.photos[0].value,
            role: 'Student'
          })
          newUser.save(err => {
            if (err) throw err
            return done(null, newUser)
          })
        }

      })
    })
  }))

  app.get('/auth', passport.authenticate('facebook', {scope: 'email'}))
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/authFailed'
  }))
  app.get('/logout', (req, res) => {
    req.logout()
    res.send('Logged Out')
  })

// used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

// used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findOne({id}, function (err, user) {
      done(err, user)
    })
  })
}

module.exports = {init}

