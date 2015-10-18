'use strict';

var Router = require('koa-router');
var middleware = require('../middleware');

module.exports = function (hds) {

    var router = new Router();

    // kinds methods
    router.post('/_new/:kind', middleware.checkUser, createKind);

    return router.middleware();

    // kinds methods

    function* createKind () {
        var data = this.request.body;
        console.log(data);
        try {
            var value = yield hds.Kind.create(this.params.kind, data).save();
            console.log(value);
            this.body = {
                status: 'created',
                kindID: value._id
            };
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }
};