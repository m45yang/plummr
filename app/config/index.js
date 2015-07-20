var debug = require('debug')('battlehack-toronto:config');

// returns function to run configurations in config folder
var configure = function () {
  var modules = arguments;
  for (var m in modules) {
    if (typeof(modules[m]) === 'string') {
      debug('Configuring: ' + modules[m]);
      require('./' + modules[m]);
    }
  }
}

module.exports = configure;
