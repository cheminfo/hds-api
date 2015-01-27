'use strict';

var Router = require('koa-router');
var middleware = require('../middleware');

module.exports = function (hds) {

    var router = new Router();

    router.get('/:kind/:entryId', middleware.validateParameters([{type: 'objectid', name: 'entryId'}]), getEntry);

    return router.middleware();

    function*getEntry() {
        try {
            var entry = yield hds.Entry.findOne(this.params.kind, {_id: this.params.entryId}).exec();
            if (entry) {
                this.body = entry;
            } else {
                this.hds_jsonError(404, 'entry ' + this.params.entryId + ' not found');
            }
        } catch (e) {
            this.hds_jsonError(404, 'kind ' + this.params.kind + ' not found');
        }
    }

};
