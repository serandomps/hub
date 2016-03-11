var serand = require('serand');
var navigation = require('navigation');

var links = {
    home: {
        url: '/',
        title: 'serandives.com'
    },
    menu: [{
        url: '/hub',
        title: 'Hub'
    }, {
        url: '/domains',
        title: 'Domains'
    }, {
        url: '/configs',
        title: 'Configs'
    }]
};

var render = function () {
    $.ajax({
        url: '/apis/v/menus/0',
        headers: {
            'X-Host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            serand.emit('navigation', 'render', data);
        },
        error: function () {

        }
    });
};

module.exports = function (sandbox, fn, options) {
    navigation(sandbox, fn, links);
};

serand.on('user', 'logged in', function (usr) {
    render();
});

serand.on('user', 'logged out', function (usr) {
    render();
});
