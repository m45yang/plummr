// dependencies
var debug = require('debug')('battlehack-toronto:controllers');
var passport = require('passport');
var User = require('../models/user');
var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "zntsrn8qhwbzz5fy",
  publicKey: "qtgj9442tfxb5gnw",
  privateKey: "9e4895af698058bf6a0c79c2afbc1fef"
});

// users controller
var users = {
  new: function (req, res, next) {
    res.render('auth/register', {message: req.flash('message'), username: req.flash('username'), email: req.flash('email')});
  },
  create: function (req, res, next) {
    if (!req.body.username || !req.body.email || !req.body.password) {
      req.flash('message', 'Please fill in all the fields!');
      req.flash('username', req.body.username);
      req.flash('email', req.body.email);
      return res.redirect('/register');
    }

    passport.authenticate('register', {
      successRedirect: '/',
      failureRedirect: '/register',
      failureFlash: true
    })(req, res, next);
  },
  show: function (req, res, next) {
    // find user and show
    User.findByUsername(req.params.username, function (err, profile) {
      res.render('users/show', {message: req.flash('message'), user: req.user, profile: profile});
    });
  },
  search: function (req, res, next) {
    // SHOW ALL THE USERS ASDLFKJWEOI
    User.find({}).where('chatroom').ne(undefined).exec(function (err, users) {
      res.render('users/search', {message: req.flash('message'), user: req.user, users: users});
    });
  },
  edit: function (req, res, next) {
    User.findById(req.user.id, function (err, user) {
      gateway.clientToken.generate({}, function (err, response) {
        res.render('users/edit', {message: req.flash('message'), user: user, clientToken: response.clientToken});
      });
    });
  },
  update: function (req, res, next) {
    // TODO: add confirmation step
    User.findById(req.user.id, function (err, user) {
      user.username = req.body.username;
      user.email = req.body.email;
      user.desc = req.body.desc;
      user.skills = req.body.skills;
      // TODO: encrypt password
      if (req.body.password) user.password = req.body.password;

      user.save(function (err, user) {
        debug('User updated:\n' + user);
        req.login(user, function (err) {
          debug('Re-login user...');
          res.redirect('/');
        })
      });
    });
  },
  addFunds: function (req, res, next) {
    // var nonceFromTheClient = req.body.payment_method_nonce;
    var nonceFromTheClient = 'fake-valid-nonce';

    // server must deal with received nonce after this.
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: nonceFromTheClient,
    }, function (err, result) {
      if (result) {
        req.flash('message', '$10 was successfully deposited in your account!');
        User.findById(req.user.id, function (err, user) {
          user.credit += 10; // add funds
          user.save(function (err, user) {
            debug('$10 credit added to ' + user.username + '\'s account');
            res.redirect('/credit');
          });
        });
      }
    });
  },
  getCredit: function(req, res, next) {
    User.findById(req.user.id, function (err, user) {
      gateway.clientToken.generate({}, function (err, response) {
        res.render('users/credit', {message: req.flash('message'), user: user, clientToken: response.clientToken});
      });
    });
  }
}

// expose
module.exports = users;
