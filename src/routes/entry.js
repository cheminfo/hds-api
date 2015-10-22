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
    router.post('/:kind', checkKind, checkUser, createEntry);
    router.get('/:kind/:entryId', validateEntry, checkKind, checkEntry, checkUser, getEntry);
    router.put('/:kind/:entryId', validateEntry, checkKind, checkEntry, checkUser, changeEntry);
    router.delete('/:kind/:entryId', validateEntry, checkKind, checkEntry, checkUser, deleteEntry);
    router.post('/:kind/_find', checkKind, checkUser, queryEntry);

    // attachments methods
    router.get('/:kind/:entryId/:attachmentId', validateAttachment, checkKind, checkEntry, getAttachment);
    router.put('/:kind/:entryId/:attachmentId', validateAttachment, checkKind, checkEntry, replaceAttachment);

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

    function* checkEntry (next) {
        var entry = yield this.state.hds_kind.findOne({_id: this.params.entryId}).exec();
        if (entry) {
            this.state.hds_entry = entry;
            yield next;
        } else {
            this.hds_jsonError(404, 'entry ' + this.params.entryId + ' not found');
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
        var data = this.request.body;
        try {
            var value = yield hds.Entry.create(this.params.kind, data, {owner: this.state.user.email}).save();
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
            for (var i in this.request.body)
                if (i[0] !== '_')
                    this.state.hds_entry[i] = this.request.body[i];
            yield this.state.hds_entry.save();
            this.body = {status: 'modified'};
        } catch (err) {
            this.hds_jsonError(500, err);
        }
    }

    function* queryEntry() {
        try {
            var data = this.request.body;
            var from = data.from || 0;
            var limit = data.limit || 20;
            var entries = yield this.state.hds_kind
                .find(data.query)
                .skip(from)
                .limit(limit)
                .exec();
            if (!entries)
                this.hds_jsonError(404, 'entries ' + this.request.find.query + ' not found');
            this.body = {
                from: from,
                to: entries.length + from,
                total: entries.length,
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
            var att = yield entry.getFile(this.params.attachmentId, true);
            this.set('Content-Type', att.mimetype);
            this.set('Content-Disposition', 'attachment;filename="' + att.filename + '"');
            this.body = att.stream;
        } catch (e) {
            this.hds_jsonError(404, 'attachment ' + this.params.attachmentId + ' not found');
        }
    }

    function* replaceAttachment() {
        var entry = this.state.hds_entry;
        var new_att = this.request.body;
        try {
            var att = yield entry.getFile(this.params.attachmentId, true);
            att.mimetype = new_att.mimetype;
            att.filename = new_att.filename;
            att.content = new_att.content;
            this.body = {status: 'modified'};
        } catch (e) {
            this.hds_jsonError(404, 'attachment ' + this.params.attachmentId + ' not found');
        }
    }
};