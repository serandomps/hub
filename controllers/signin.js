var utils = require('hub-utils');
var serand = require('serand');

var clientId;

var pending;

var ready = false;

module.exports.prepare = function (ctx, next) {
  if (clientId) {
    ctx.options = {
      clientId: clientId
    };
    return next();
  }
  utils.configs('boot', function (err, config) {
    console.log(config);
    var clients = config.clients;
    clientId = clients.serandives;
    ctx.options = {
      clientId: clientId
    };
    next();
  });
};

module.exports.ready = function (ctx, next) {
  if (ready) {
    return next();
  }
  pending = next;
};

serand.on('user', 'ready', function (usr) {
  ready = true;
  if (!pending) {
    return;
  }
  setTimeout(pending, 0);
});