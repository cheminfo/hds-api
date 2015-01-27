'use strict';

var Router = require('koa-router');

module.exports = function (hds) {

    var router = new Router();

    router.get('/:kind/:entryId', getEntry);

    return router.middleware();

    function*getEntry() {
        try {
            var entry = yield hds.Entry.findOne(this.params.kind, {_id: this.params.entryId});
            if (entry) {
                this.body = entry;
            } else {
                this.status = 404;
                this.body = {
                    error: 'entry ' + this.params.entryId + ' not found'
                };
            }
        } catch (e) {
            this.status = 404;
            this.body = {
                error: 'kind ' + this.params.kind + ' not found'
            };
        }
    }

};
