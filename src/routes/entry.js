'use strict';

var Router = require('koa-router');
var middleware = require('../middleware');

var validateEntry = middleware.validateParameters([
    { name: 'entryId', type: 'objectid' }
]);
var validateAttachment = middleware.validateParameters([
    { name: 'entryId', type: 'objectid' },
    { name: 'attachmentId', type: 'objectid' }
]);

module.exports = function (hds) {

    var router = new Router();

    // entries methods
    router.post('/:kind', checkKind, createEntry);
    router.get('/:kind/:entryId', validateEntry, checkKind, checkEntry, getEntry);
    router.put('/:kind/:entryId', validateEntry, checkKind, checkEntry, changeEntry);
    router.delete('/:kind/:entryId', validateEntry, checkKind, checkEntry, deleteEntry);
    router.get('/:kind/_find', validateEntry, checkKind, multipleEntries, queryEntry);

    // attachments methods
    router.get('/:kind/:entryId/:attachmentId', validateAttachment, checkKind, checkEntry, getAttachment);

    return router.middleware();

    // middlewares

    function* checkKind(next) {
        try {
            this.state.hds_kind = yield hds.Kind.get(this.params.kind);
        } catch (e) {
            return this.hds_jsonError(404, 'kind ' + this.params.kind + ' not found');
        }
        yield next;
    }

    function* checkEntry(next) {
        var entry = yield this.state.hds_kind.findOne({_id: this.params.entryId}).exec();
        if (entry) {
            this.state.hds_entry = entry;
            yield next;
        } else {
            this.hds_jsonError(404, 'entry ' + this.params.entryId + ' not found');
        }
    }

    function* multipleEntries(next) {
        var entry = yield this.state.hds_kind.find(this.request.find.query).exec();
        if (entry) {
            this.state.hds_entries = entry;
            yield next;
        } else {
            this.hds_jsonError(404, 'entries ' + this.request.find.query + ' not found');
        }
    }

    // entries methods

    function* getEntry() {
        var entry = this.state.hds_entry.toObject();
        if (entry._at) {
            var i = 0, l = entry._at.length, at;
            for (; i < l; i++) {
                at = entry._at[i];
                at.url = this.state.hds_host + 'entry/' + this.params.kind + '/' + entry._id + '/' + at._id;
            }
        }
        this.body = entry;
    }

    function* createEntry() {
        var data = this.query;
        try {
            var value = yield this.state.hds_kind.create(this.params.kind, data).save();
            this.body = {
                status: 'created',
                entryID: value._id
            };
        } catch(err) {
            this.hds_jsonError(500, err);
        }
    }

    function* deleteEntry() {
        try {
            yield this.state.hds_entry.remove();
            this.body = {status: 'deleted'};
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* changeEntry() {
        try {
            yield this.state.hds_entry.update({ $set: this.params.data});
            this.body = {status: 'modified'};
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* queryEntry() {
        try {
            var from = this.request.find.from || 0;
            var limit = this.request.find.limit || 20;
            var entries = yield this.state.hds_entries.aggregate([
                {$skip: from},
                {$limit: limit}
            ]).exec();
            this.body = {
                from: from,
                to: limit,
                total: (limit - from),
                entry: entries
            };
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    // attachments methods

    function* getAttachment() {
        var entry = this.state.hds_entry;
        try {
            var att = yield entry.getAttachment(this.params.attachmentId, true);
            this.set('Content-Type', att.mimetype);
            this.set('Content-Disposition', 'attachment;filename="' + att.filename + '"');
            this.body = att.stream;
        } catch (e) {
            this.hds_jsonError(404, 'attachment ' + this.params.attachmentId + ' not found');
        }
    }
};