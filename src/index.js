'use strict';

var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');
var bodyParser = require('koa-body-parser');

var entry = require('./routes/entry');
var kind = require('./routes/kind');

module.exports = function hdsAPIFactory(hds, options) {

    var app = koa();

    options = options || {};

    app.context.hds_jsonError = function (code, message, details) {
        this.status = code;
        this.body = {
            error: message
        };
        if (details) {
            this.body.details = details;
        }
    };

    if (options.cors) {
        var origin = options.cors.origin || '*';
        app.use(function*(next) {
            this.set('Access-Control-Allow-Origin', origin);
            if (this.method === 'OPTIONS') {
                this.status = 200;
                this.set('Allow', 'GET,POST,PUT,DELETE,OPTIONS');
                this.set('Access-Control-Allow-Headers', 'content-type');
            } else {
                yield next;
            }
        });
    }

    app.use(function*(next) {
        this.state.hds_host = this.protocol + '://' + this.host + '/';
        yield next;
        if (!this.body) {
            return this.hds_jsonError(404, 'No route matching "' + this.method + ' ' + this.path + '"');
        }
    });

    var router = new Router();

    router.get('/', function *() {
        this.body = {
            eln: 'Welcome to the hds JSON API',
            version: '0.0.1'
        };
    });

    app.use(router.middleware());
    app.use(bodyParser());
    app.use(mount('/entry', entry(hds)));
    app.use(mount('/kind', kind(hds)));

    return app;

};
