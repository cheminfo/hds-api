'use strict';

var Router = require('koa-router');
var middleware = require('../middleware');

module.exports = function (hds) {

    var router = new Router();

    // kinds methods
    router.post('/_new/:kind', checkUser, createKind);
    router.delete('/:kind', checkKind, checkUser, deleteKind);
    //router.put('/:kind', checkKind, checkUser, updateKind);
    router.get('/:kind', checkKind, checkUser, getKind);
    router.get('/_list', checkUser, listKinds);

    return router.middleware();

    // middlewares

    function* checkUser (next) {
        if (!this.state.user) {
            this.state.user = {
                email: 'test@test.com'
            };
        }
        yield next;
    }

    function* checkKind (next) {
        try {
            this.state.hds_kind = yield hds.Kind.get(this.params.kind);
        } catch (e) {
            return this.hds_jsonError(404, 'kind ' + this.params.kind + ' not found');
        }
        yield next;
    }

    // kinds methods

    function* createKind () {
        var data = this.request.body;
        try {
            var value = yield hds.Kind.create(this.params.kind, data).save();

            this.body = {
                status: 'created',
                kindID: value._id
            };
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    /*
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
    */

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
            this.body = this.state.hds_kind.getSchema();
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* listKinds(){
        try {
            this.body = hds.Kind.getList();
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }
};