// dependencies
var debug = require('debug')('battlehack-toronto:auth');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var User = require('../../models/user');

// passport strategy
var signin = new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    debug('Sign in attempt:\n' + JSON.stringify(req.body));

    var reject = function () {
      debug('Incorrect username or password.');
      req.flash('username', username);
      return done(null, false, req.flash('message', 'Incorrect username or password.'));
    }

    var authenticate = function (err, user) {
      if (err) {
        debug('Sign in error:\n' + err);
        return done(err);
      }

      // TODO: check against encrypted password
      if (!user || password !== user.password) {
        return reject();
      }

      debug('Authenticated:\n' + user);

      return done(null, {
        id: user._id,
        username: user.username,
        email: user.email
      });
    }

    if (validator.isEmail(username)) {
      User.findOne({email: username}, '_id username email password', authenticate);
    } else {
      User.findOne({username: username}, '_id username email password', authenticate);
    }
  }
);

// expose
module.exports = signin;
