'use strict';

var Entry = exports.Entry = {};

Entry.findOne = function (kind, conditions) {
    return new Promise(function (resolve, reject) {
        if (kind === 'kind1') { // kind exists
            if (conditions._id === 'id1') { // id exists
                resolve({
                    _id: 'id1',
                    field1: 'hello'
                });
            } else {
                resolve(null);
            }
        } else {
            throw new Error('Kind ' + kind + ' is not loaded');
        }
    });
};
