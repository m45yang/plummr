// dependencies
var debug = require('debug')('battlehack-toronto:auth');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var User = require('../../models/user');

// passport strategy
var register = new LocalStrategy({
    passReqToCallback : true
  },
  function (req, username, password, done) {
    debug('Register attempt:\n' + JSON.stringify(req.body));

    var email = req.body.email;

    // validations
    if (!validator.isValidSlug(username))
      return done(null, false, req.flash('message', 'Your username must contain only alphanumeric characters and hyphens. The first and last characters cannot be a hyphen.'));
    if (!validator.isEmail(email))
      return done(null, false, req.flash('message', 'Please enter a valid email.'));
    if (!validator.isValidPassword(password))
      return done(null, false, req.flash('message', 'Your password must be at least 6 characters long and contain at least one letter and one number.'));

    // TODO: ensure uniqueness of username and email
    // TODO: encrypt password
    User.create({
      username: username,
      password: password,
      email: email
    }, function (err, user) {
      if (err) {debug('Error creating user:\n' + err); return done(err);}

      debug('User created:\n' + user);

      return done(null, {
        id: user._id,
        username: user.username,
        email: user.email
      });
    });
  }
);

// expose
module.exports = register;
