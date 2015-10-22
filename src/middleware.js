'use strict';

var objectID = /^[0-9a-fA-F]{24}$/;

exports.validateParameters = function (params) {
    if (!Array.isArray(params)) {
        params = [params];
    }
    var l = params.length;
    return function*(next) {
        for (var i = 0; i < l; i++) {
            var param = params[i];

            var paramName = param;
            if (typeof param === 'object') {
                paramName = param.name;
            }

            var value = this.params[paramName] || this.request.query[paramName] || (this.request.body ? this.request.body[paramName] : null);

            if (!value) {
                return this.hds_jsonError(400, 'required parameter: ' + paramName);
            }

            if (param.type) {
                switch (param.type) {
                    case 'objectid':
                        if (!objectID.test(value)) {
                            return this.hds_jsonError(400, 'parameter ' + paramName + ' must be a valid ObjectID');
                        }
                        break;
                }
            }

            this.params[paramName] = value;
        }
        yield next;
    };
};