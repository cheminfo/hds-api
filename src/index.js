'use strict';

var Router = require('koa-router');
var mount = require('koa-mount');

var entry = require('./routes/entry');

module.exports = function hdsAPIFactory(app, hds) {

    var router = new Router();

    router.get('/', function *() {
        this.body = {
            eln: 'Welcome to the hds JSON API',
            version: '0.0.1'
        };
    });

    app.use(router.middleware());

    app.use(mount('/entry', entry(hds)));

};
