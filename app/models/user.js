// dependencies
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {type: String, index: {unique: true}},
  email: {type: String, index: {unique: true}},
  password: String,
  skills: {type: String, default: 'No skills provided'},
  desc: {type: String, default: 'No description given'},
  credit: {type: Number, default: 0},
  chatroom: ObjectId
});

// static methods
userSchema.statics.findByUsername = function (username, callback) {
  return this.findOne({username: username}, callback);
};
userSchema.statics.findByEmail = function (email, callback) {
  return this.findOne({email: email}, callback);
};

// model
var User = mongoose.model('User', userSchema);

// export
module.exports = User;
