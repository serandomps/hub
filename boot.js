var pager = require('page');
var dust = require('dust')();

var serand = require('serand');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;
var layout = serand.layout('serandomps~hub@master');

var user;

//registering jquery, bootstrap etc. plugins
require('upload');
//init app

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

page('/hub', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-self')
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
        .add('hub-domains', {
            action: 'list'
        })
        .render();
});

page('/domains/add', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-domains', {
            action: 'add'
        })
        .render();
});

page('/domains/:id', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-domains', {
            action: 'details',
            id: ctx.params.id
        })
        .render();
});

page('/domains/:id/drones', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-drones', {
            id: ctx.params.id
        })
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

page('/configs', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-configs', {
            action: 'list'
        })
        .render();
});

page('/configs/add', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-configs', {
            action: 'add'
        })
        .render();
});

page('/configs/:id', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-configs', {
            action: 'details',
            id: ctx.params.id
        })
        .render();
});

pager();

serand.on('user', 'logged in', function (data) {
    user = data;
    var ctx = current('/:action?val=?');
    console.log(ctx);
    redirect('/servers');
});

serand.on('user', 'logged out', function (data) {
    user = null;
    redirect('/');
});

serand.emit('boot', 'init');