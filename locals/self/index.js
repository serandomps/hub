var dust = require('dust')();
var serand = require('serand');
var redirect = serand.redirect;

dust.loadSource(dust.compile(require('./template'), 'hub-self-ui'));

module.exports = function (sandbox, fn, options) {
    dust.render('hub-self-ui', {}, function (err, out) {
        if (err) {
            fn(err);
            return;
        }
        var el = $(out).appendTo(sandbox);
        $('.self-up', el).click(function () {
            serand.emit('hub', 'self up');
        });
        $('.clients-up', el).click(function () {
            serand.emit('hub', 'clients up');
        });
        fn(false, function () {
            $('.hub-self', sandbox).remove();
        });
    });
};
