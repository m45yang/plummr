// dependencies

// controllers
var users = require('../controllers/users');
var sessions = require('../controllers/sessions');

module.exports = function (router) {

  /* GET register. */
  router.get('/register', users.new);

  /* POST register. */
  router.post('/register', users.create);

  /* GET sign in. */
  router.get('/signin', sessions.new);

  /* POST sign in. */
  router.post('/signin', sessions.create);

  /* POST sign out */
  router.all('/signout', sessions.destroy);

  return router;

}
