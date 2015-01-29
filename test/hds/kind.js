'use strict';

var constants = require('../constants');

exports.get = function (kind) {
    if (kind === constants.KIND_EXIST) {
        return Promise.resolve(FakeKind);
    } else {
        return Promise.reject('Kind ' + kind + ' is not loaded');
    }
};

var FakeKind = {};
FakeKind.findOne = function (conditions) {
    return {
        exec: function () {
            if (conditions._id === constants.ENTRY_ID_EXIST) {
                return Promise.resolve(mongoosify({
                    _id: constants.ENTRY_ID_EXIST,
                    field1: 'hello'
                }));
            } else {
                return Promise.resolve(null);
            }
        },
        lean: returnThis
    };
};

function returnThis() {
    return this;
}

function mongoosify(object) {
    object.toObject = function () {
        return this;
    };
    return object;
}
