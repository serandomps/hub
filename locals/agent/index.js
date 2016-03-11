var serand = require('./serand');

var start = function (data) {
    console.log('received event:drone start');
    console.log(data);
    $.post('/apis/v/drones', data, function (data) {
        console.log(data);
    });
};

var stop = function (data) {
    console.log('received event:drone stop');
    console.log(data);
    $.ajax({
        url: '/apis/v/drones/' + data.id,
        type: 'DELETE',
        success: function (data) {
            console.log(data);
        }
    });
};

var selfup = function (data) {
    console.log('received event:self up');
    console.log(data);
    $.post('/apis/v/hub/self/up', function (data) {
        console.log(data);
    });
};

var clientup = function (data) {
    console.log('received event:clients up');
    console.log(data);
    $.post('/apis/v/hub/client/up', function (data) {
        console.log(data);
    });
};

var restart = function (data) {
    console.log('received event:clients up');
    console.log(data);
    $.post('/apis/v/domains/' + data.id + '/restart', function (data) {
        console.log(data);
    });
};

serand.on('user', 'logged in', function (data) {
    serand.on('hub', 'drone start', start);
    serand.on('hub', 'drone stop', stop);
    serand.on('hub', 'self up', selfup);
    serand.on('hub', 'clients up', clientup);
    serand.on('hub', 'domain restart', restart);
});

serand.on('user', 'logged out', function (data) {
    serand.off('hub', 'drone start', start);
    serand.off('hub', 'drone stop', stop);
    serand.off('hub', 'self up', selfup);
    serand.off('hub', 'clients up', clientup);
    serand.off('hub', 'domain restart', restart);
});