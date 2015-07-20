// dependencies
var debug = require('debug')('battlehack-toronto:chat-server');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// models
var Chatroom = require('./models/chatroom');
var User = require('./models/user');

// chat server
var chatServer = function (server) {

  debug('Starting public chat server...')

  // inject server into socket.io
  var io = require('socket.io')(server);


  // public chats
  var publicChat = io.of('/chat/public');

  publicChat.on('connection', function (socket) {

    var state = {
      host: undefined,
      client: undefined,
      chatroomId: undefined,
      ownerId: undefined,
      isOwner: false
    };

    // init for owners
    socket.on('init', function (ownerUsername) {
      state.host = socket.id; // save sid in state
      state.client = socket.id;

      User.findByUsername(ownerUsername, function (err, owner) {
        // create chat object in database
        Chatroom.create({
          sid: socket.id,
          owner: owner.id
        }, function (err, chatroom) {
          owner.chatroom = chatroom.id;

          debug('Public room created:\n' + chatroom);

          // save and emit init
          owner.save(function (err) {
            state.ownerId = owner.id;
            state.chatroomId = chatroom.id;
            state.isOwner = true;
            socket.emit('init');
          });
        });
      });
    });

    // subscribe for guests
    socket.on('subscribe', function (ownerUsername) {
      state.client = socket.id;

      User.findByUsername(ownerUsername, function (err, owner) {
        // if owner has a chatroom, join room; else send subscribe failed
        if (owner.chatroom) {
          Chatroom.findById(owner.chatroom, function (err, chatroom) {
            // join owner's chatroom
            socket.join(chatroom.sid);

            // add state information
            state.host = chatroom.sid;
            state.chatroomId = chatroom.id;
            state.ownerId = owner.id;

            debug('Client ' + socket.id + ' subscribed to room ' + chatroom.sid);

            socket.emit('subscribe');
          });
        } else {
          socket.emit('subscribe failed');
        }
      });
    });

    // messages
    socket.on('message', function (msg) {
      debug('Message received from ' + msg.sender + ' in room ' + state.host + ': ' + msg.message);
      socket.emit('message', msg);
      socket.broadcast.to(state.host).emit('message', msg);
    });

    // private chat request
    socket.on('request private', function (user) {
      socket.broadcast.to(state.host).emit('request private', user);
    });

    // accept private chat request
    socket.on('accept request', function (email) {
      // generate new chat room including both parties
      User.findById(state.ownerId, function (err, owner) {
        User.findByEmail(email, function (err, guest) {

            // save and emit 'open private'
            owner.save(function (err) {
              require('crypto').randomBytes(48, function(ex, buf) {
                var token = buf.toString('hex');
                socket.emit('open private', {
                  host: owner.email,
                  guest: guest.email,
                  token: token
                });
                socket.broadcast.to(state.host).emit('open private', {
                  host: owner.email,
                  guest: guest.email,
                  token: token
                });
              });
            });
        });
      });
      socket.broadcast.to(state.host).emit('open private', email);
    });

    // disconnect
    socket.on('disconnect', function () {
      debug('Socket ' + socket.id + ' disconnected from room ' + state.host);
      // if this socket was the owner, send failure message to guests
      if (state.isOwner) {
        socket.emit('subscribe failed');
      }

      // if room is empty (socket.io has already removed it) or uninitialized, delete chatroom from db
      if (!io.nsps['/chat/public'].adapter.rooms[state.host] && state.ownerId) {
        debug('Deleting empty room: ' + state.host);
        User.findById(state.ownerId, function (err, owner) {
          // TODO: better error handling
          if (owner) {
            Chatroom.findById(owner.chatroom, function (err, chatroom) {
              // delete chatroom
              if (chatroom) {
                chatroom.remove(function (err, chatroom) {
                  debug('Public room deleted:\n' + chatroom);
                  owner.chatroom = undefined; // remove chatroom value from owner
                  owner.save();
                });
              }
            });
          }
        });
      }
    });

  });


  // private chats
  var privateChat = io.of('/chat/private');

  // TODO: implement private chat
  privateChat.on('connection', function (socket) {

    var state = {
      host: undefined,
      client: undefined
    };

    // subscribe
    socket.on('subscribe', function (subscription) {
      state.host = subscription.token; // save sid in state
      state.client = socket.id;

      socket.join(state.host);
      socket.emit('subscribe');
      socket.broadcast.to(state.host).emit('joined', subscription.email);
    });

    // messages
    socket.on('message', function (msg) {
      debug('Message received from ' + msg.sender + ' in room ' + state.host + ': ' + msg.message);
      socket.emit('message', msg);
      socket.broadcast.to(state.host).emit('message', msg);
    });

    // code collaboration
    socket.on('code', function (code) {
      socket.broadcast.to(state.host).emit('code', code);
    });
  });

};

module.exports = chatServer;
