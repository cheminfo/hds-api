'use strict';

var hdsapi = require('../src/index');
var hds = require('hds');

// Load kinds
require('./kinds_metabo');

var connection = hds.init({
    database: {
        "host": "localhost",
        "name": "metabo-test",
        "username": null,
        "password": null,
        "port": 27119
    }
});

connection.then(function (err) {
    if (err) throw err;
    var app = hdsapi(hds,{cors:{origin:"www.cheminfo.org"}});

    app.listen(3000);
});
