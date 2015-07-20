// dependencies
var passport = require('passport');
var User = require('../models/user');
var Chatroom = require('../models/chatroom');

// chatrooms controller
var chatrooms = {
  show: function (req, res, next) {
    // get tutor data
    User.findByUsername(req.params.username, function (err, tutor) {
      // show tutor chat view if the current user is the tutor; else show student chat view
      // TODO: handle case where tutor name does not exist
      if (tutor && tutor.id === req.user.id) {
        res.render('chatrooms/tutor', {message: req.flash('message'), user: req.user});
      } else {
        res.render('chatrooms/student', {message: req.flash('message'), user: req.user, tutor: tutor});
      }
    });
  },
  show_private: function (req, res, next) {
    res.render('chatrooms/private_chat', {message: req.flash('message'), user: req.user, token: req.params.token});
  }
}

// expose
module.exports = chatrooms;
