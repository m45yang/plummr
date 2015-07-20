// dependencies
var passport = require('passport');

// sessions controller
var sessions = {
  new: function (req, res, next) {
    res.render('auth/signin', {message: req.flash('message'), username: req.flash('username')});
  },
  create: function (req, res, next) {
    if (!req.body.username || !req.body.password) {
      req.flash('message', 'Missing credentials!');
      req.flash('username', req.body.username);
      return res.redirect('/signin');
    }

    passport.authenticate('signin', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next);
  },
  destroy: function (req, res) {
    req.logout();
    res.redirect('/');
  }
};

// expose
module.exports = sessions;
