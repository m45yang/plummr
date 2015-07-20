// dependencies
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// schema
var Schema = mongoose.Schema;
var chatroomSchema = new Schema({
  sid: String,
  owner: ObjectId,
  guests: [ObjectId]
});

// model
var Chatroom = mongoose.model('Chatroom', chatroomSchema);

// export
module.exports = Chatroom;
