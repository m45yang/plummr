var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    User.find({}, function (err, users) {
      res.render('dashboard', {message: req.flash('message'), user: req.user, users: users});
    });
  } else {
    res.render('index');
  }
});

var routeGroups = [
  'auth',
  'chatrooms',
  'users'
];

for (var r in routeGroups) {
  require('./' + routeGroups[r])(router);
}

module.exports = router;
