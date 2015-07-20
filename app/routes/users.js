// dependencies

// controllers
var users = require('../controllers/users');

module.exports = function (router) {
  /* GET all users. */
  router.get('/plummrs', users.search);

  /* GET credit */
  router.get('/credit', users.getCredit);

  /* POST add funds. */
  router.post('/add_funds', users.addFunds);

  /* GET edit user. */
  router.get('/settings', users.edit);

  /* PUT update user. */
  router.put('/:username', users.update);

  /* GET show user. */
  router.get('/:username', users.show);

  return router;

}
