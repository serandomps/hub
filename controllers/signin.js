var utils = require('utils');

var clientId;

module.exports.prepare = function (ctx, next) {
  if (clientId) {
    ctx.options = {
      clientId: clientId
    };
    return next();
  }
  utils.boot(function (err, config) {
    clientId = config.clientId;
    ctx.options = {
      clientId: clientId
    };
    next();
  });
};