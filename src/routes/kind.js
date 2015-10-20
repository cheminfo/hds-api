'use strict';

var Router = require('koa-router');
var middleware = require('../middleware');

module.exports = function (hds) {

    var router = new Router();

    // kinds methods
    router.post('/_new/:kind', middleware.checkUser, createKind);
    router.put('/:kind', middleware.checkKind, middleware.checkUser, updateKind);
    router.delete('/:kind', middleware.checkKind, middleware.checkUser, deleteKind);
    router.get('/:kind', middleware.checkKind, middleware.checkUser, getKind);

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

    function* updateKind () {
        var data = this.request.body;
        try {
            for (var d in data)
                if (d[0] !== '_')
                    this.state.hds_kind[i] = this.request.body[d];
            yield this.state.hds_kind.save();
            this.body = {status: 'modified'};
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* deleteKind() {
        try {
            yield this.state.hds_kind.remove();
            this.body = {status: 'deleted'};
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* getKind() {
        try {
            this.body = this.state.hds_kind;
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }
};