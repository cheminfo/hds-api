'use strict';

var Entry = exports.Entry = {};

var constants = require('./constants');

Entry.findOne = function (kind, conditions) {
    return {
        exec: function() {
            return new Promise(function (resolve, reject) {
                if (kind === constants.KIND_EXIST) {
                    if (conditions._id === constants.ENTRY_ID_EXIST) {
                        resolve({
                            _id: constants.ENTRY_ID_EXIST,
                            field1: 'hello'
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    throw new Error('Kind ' + kind + ' is not loaded');
                }
            });
        }
    };
};
