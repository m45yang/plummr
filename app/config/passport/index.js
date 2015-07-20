// dependencies
var debug = require('debug')('battlehack-toronto:auth');
var passport = require('passport');
var User = require('../../models/user');

// load strategies
var signin = require('./signin');
var register = require('./register');

// serializers
passport.serializeUser(function (user, done) {
  debug('Serializing user:\n' + user);
  done(null, user.id);
});
passport.deserializeUser(function (userid, done) {
  User.findById(userid, function (err, user) {
    debug('Deserializing user:\n' + user);
    done(err, user);
  });
});

// use these strategies
passport.use('signin', signin);
passport.use('register', register);
