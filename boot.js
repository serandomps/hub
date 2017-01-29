var dust = require('dust')();

var serand = require('serand');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;

var app = serand.boot('serandomps~hub@master');
var layout = serand.layout(app);

var signin = require('./controllers/signin');

var user;

var dest;

page('/signin', signin.prepare, function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-signin', ctx.options)
        .render();
});

page('*', signin.ready, function (ctx, next) {
    user ? next() : redirect('/signin');
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

page('/apps', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-apps', {
            action: 'list'
        })
        .render();
});

page('/apps/add', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-apps', {
            action: 'add'
        })
        .render();
});

page('/apps/:id', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-apps', {
            action: 'details',
            id: ctx.params.id
        })
        .render();
});

page('/add', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-vehicles-create')
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

page('/serand/configs', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-serand-configs', {
            action: 'list'
        })
        .render();
});

page('/serand/configs/add', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-serand-configs', {
            action: 'add'
        })
        .render();
});

page('/serand/configs/:id', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('hub-navigation')
        .area('#middle')
        .add('hub-serand-configs', {
            action: 'details',
            id: ctx.params.id
        })
        .render();
});

serand.on('user', 'login', function (path) {
    dest = path;
    redirect('/signin');
});

serand.on('user', 'ready', function (usr) {
    user = usr;
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
    redirect(dest || '/servers');
});

serand.on('user', 'logged out', function (data) {
    user = null;
    redirect('/');
});

serand.emit('serand', 'ready');
