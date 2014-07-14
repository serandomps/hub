var pager = require('page');
var dust = require('dust')();

var serand = require('serand');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;
var layout = serand.layout(require);

var user;

//registering jquery, bootstrap etc. plugins
require('upload');
//init app
serand.init(require);

page('/login', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('user-login')
        .render();
});

pager('*', function (ctx, next) {
    user ? next() : redirect('/login');
});

page('/', function (ctx) {
    layout('two-column')
        .area('#header')
        .add('hub-navigation')
        .add('breadcrumb')
        .area('#right')
        .add('auto-search')
        .area('#middle')
        .render();
});

page('/vehicles/:id', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('hub-navigation')
        .add('breadcrumb')
        .area('#middle')
        .add('auto-details', {
            id: ctx.params.id
        })
        .render();
});

page('/register', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('user-register')
        .render();
});

page('/add', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('auto-add')
        .render();
});

pager();

serand.on('user', 'login', function (data) {
    user = data;
    var ctx = current('/:action?val=?');
    console.log(ctx);
    redirect('/');
});

serand.on('user', 'logout', function (data) {
    user = null;
    redirect('/');
});

serand.emit('boot', 'init');