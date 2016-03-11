var dust = require('dust')();
var serand = require('serand');

var user;

dust.loadSource(dust.compile(require('./template'), 'hub-drones-ui'));

module.exports = function (sandbox, fn, options) {
    $.ajax({
        url: '/apis/v/drones',
        headers: {
            'X-Host': 'hub.serandives.com:4000'
        },
        data: {
            domain: options.id
        },
        dataType: 'json',
        success: function (data) {
            serand.once('hub', 'domains listed', function (domain) {
                dust.render('hub-drones-ui', {
                    domain: domain.name,
                    drones: data
                }, function (err, out) {
                    if (err) {
                        fn(err);
                        return;
                    }
                    var el = $(out).appendTo(sandbox);
                    $('.stop', el).on('click', function () {
                        var el = $(this).parent();
                        serand.emit('hub', 'drone stop', {
                            id: el.data('id')
                        });
                        el.closest('tr').remove();
                    });
                    fn(false, function () {
                        $('.hub-drones', sandbox).remove();
                    });
                });
            });
            serand.emit('hub', 'domains list', options.id);
        },
        error: function () {
            fn(true, function () {

            });
        }
    });
};
