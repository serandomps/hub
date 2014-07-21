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
    layout('one-column')
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
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-servers')
        .render();
});

page('/servers', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-servers')
        .render();
});

page('/servers/:id', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-server-details', {
            id: ctx.params.id
        })
        .render();
});

page('/servers/:id/update', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-server-details', {
            id: ctx.params.id
        })
        .render();
});

page('/domains', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-domains')
        .render();
});

page('/drones', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-drones')
        .render();
});

page('/add', function (ctx) {
    layout('one-column')
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
    redirect('/servers');
});

serand.on('user', 'logout', function (data) {
    user = null;
    redirect('/');
});

serand.emit('boot', 'init');