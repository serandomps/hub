var serand = require('serand');
var utils = require('utils');

var perms = require('./permissions');

var REFRESH_BEFORE = 10 * 1000;

var context = {
    serandives: {
        login: 'https://accounts.serandives.com/signin'
    },
    facebook: {
        login: 'https://www.facebook.com/dialog/oauth',
        location: 'https://accounts.serandives.com/auth/oauth',
        scopes: ['email', 'public_profile']
    }
};

var uzer;

var ready = false;

var send = XMLHttpRequest.prototype.send;

var ajax = $.ajax;

var queue = [];

var token = false;

var boot = false;

//anon permissions
var permissions = {};

var loginUri = function (type, location) {
    var o = context[type];
    location = location || o.location;
    var url = o.login + '?client_id=' + o.clientId
      + (location ? '&redirect_uri=' + location : '')
      + (o.scopes ? '&scope=' + o.scopes.join(',') : '');
    console.log(url);
    return url;
};

var sayReady = function () {
    if (!ready) {
        ready = true;
        return;
    }
    serand.emit('user', 'ready', user());
};

var user = function (usr) {
    if (usr || usr === null) {
        uzer = usr;
        return serand.store('user', uzer);
    }
    return uzer || (uzer = serand.store('user'));
};

var none = function () {

};

$.ajax = function (options) {
    if (token && !options.token) {
        queue.push(options);
        return;
    }
    var success = options.success || none;
    var error = options.error || none;
    options.success = function (data, status, xhr) {
        success.apply(null, Array.prototype.slice.call(arguments));
    };
    options.error = function (xhr, status, err) {
        if (xhr.status !== 401) {
            error.apply(null, Array.prototype.slice.call(arguments));
            return;
        }
        if (options.token) {
            error.apply(null, Array.prototype.slice.call(arguments));
            return;
        }
        console.log('transparently retrying unauthorized request');
        token = true;
        refresh(function (err) {
            token = false;
            if (err) {
                error({status: 401});
                queue.forEach(function (options) {
                    if (!options.error) {
                        return;
                    }
                    options.error({status: 401});
                });
                queue = [];
                serand.emit('user', 'login');
                return;
            }
            options.success = success;
            options.error = error;
            $.ajax(options);
            queue.forEach(function (options) {
                $.ajax(options);
            });
            queue = [];
        });
    };
    return ajax.call($, options);
};

XMLHttpRequest.prototype.send = function () {
    var usr = user();
    if (usr) {
        this.setRequestHeader('Authorization', 'Bearer ' + usr.access);
    }
    send.apply(this, Array.prototype.slice.call(arguments));
};

utils.configs('boot', function (err, config) {
    var name;
    var clients = config.clients;
    console.log(clients);
    for (name in clients) {
        console.log(name);
        if (!clients.hasOwnProperty(name)) {
            continue;
        }
        var o = context[name];
        o.clientId = clients[name];
        var pending = o.pending;
        if (!pending) {
            continue;
        }
        var options = pending.options;
        pending.done(false, loginUri(name, options.location));
        delete o.pending;
    }
    boot = true;
});

var expires = function (expin) {
    return new Date().getTime() + expin - REFRESH_BEFORE;
};

var next = function (expires) {
    var exp = expires - new Date().getTime();
    return exp > 0 ? exp : null;
};

var initialize = function () {
    var usr = user();
    if (!usr) {
        return sayReady();
    }
    console.log(usr);
    var nxt = next(usr.expires);
    if (!nxt) {
        user(null);
        return sayReady();
    }
    refresh(function (err) {
        sayReady();
    });
};

var refresh = function (done) {
    done = done || none;
    var usr = user();
    if (!usr) {
        return done(true);
    }
    $.ajax({
        token: true,
        method: 'POST',
        url: '/apis/v/tokens',
        headers: {
            'X-Host': 'accounts.serandives.com'
        },
        data: {
            grant_type: 'refresh_token',
            refresh_token: usr.refresh
        },
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function (data) {
            usr = {
                username: usr.username,
                access: data.access_token,
                refresh: data.refresh_token,
                expires: expires(data.expires_in)
            };
            user(usr);
            console.log('token refresh successful');
            var nxt = next(usr.expires);
            console.log('next refresh in : ' + Math.floor(nxt / 1000));
            setTimeout(function () {
                refresh();
            }, nxt);
            done(false, usr);
        },
        error: function (xhr) {
            console.log('token refresh error');
            user(null);
            done(xhr);
        }
    });
};

var authenticator = function (options, done) {
    var type = options.type || 'serandives';
    if (boot) {
        done(false, loginUri(type, options.location));
        return;
    }
    var o = context[type];
    o.pending = {
        options: options,
        done: done
    };
};

module.exports.can = function (permission, action) {
    var usr = user();
    var tree = usr.permissions || permissions;
    return perms.can(tree, permission, action);
};

serand.on('user', 'logout', function () {
    var usr = user();
    $.ajax({
        method: 'DELETE',
        url: '/apis/v/tokens/' + usr.access,
        headers: {
            'X-Host': 'accounts.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            console.log('logout successful');
            user(null);
            serand.emit('user', 'logged out');
        },
        error: function () {
            console.log('logout error');
            serand.emit('user', 'logout error');
        }
    });
});

serand.on('serand', 'ready', function () {
    sayReady();
});

serand.on('user', 'logged in', function (usr) {
    user(usr);
    var nxt = next(usr.expires);
    console.log('next refresh in : ' + Math.floor(nxt / 1000));
    setTimeout(function () {
        refresh();
    }, nxt);
});

serand.on('user', 'authenticator', function (options, done) {
    if (!done) {
        done = options;
        options = {};
    }
    authenticator(options, done);
});

serand.on('user', 'permissions', function (user, done) {
    $.ajax({
        method: 'GET',
        url: '/apis/v/tokens/' + user.tid,
        headers: {
            'X-Host': 'accounts.serandives.com',
            'Authorization': 'Bearer ' + user.access
        },
        dataType: 'json',
        success: function (token) {
            done(false, token);
        },
        error: function () {
            done('permissions error');
        }
    });
});

initialize();