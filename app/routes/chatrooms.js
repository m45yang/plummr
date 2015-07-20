// dependencies

// controllers
var chatrooms = require('../controllers/chatrooms');

module.exports = function (router) {

  /* GET show chatroom. */
  router.get('/:username/chat', chatrooms.show);

  /* GET show private chatroom. */
  router.get('/private-room/:token', chatrooms.show_private);

  return router;

}
