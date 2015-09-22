'use strict';

var request = require('supertest');
var hdsapi = require('..');
var hds = require('./hds');

var constants = require('./constants');

var regJson = /application\/json/;

describe('hds API', function () {

    describe('getting single entries', function () {
        var app = hdsapi(hds);
        var agent = request.agent(app.callback());

        describe('when kind and entry both exists', function () {
            it('should return the entry', function (done) {
                agent
                    .get('/entry/' + constants.KIND_EXIST + '/' + constants.ENTRY_ID_EXIST)
                    .expect(200)
                    .expect('Content-Type', regJson)
                    .expect({_id:constants.ENTRY_ID_EXIST, field1:'hello'}, done);
            });
        });

        describe('when kind exists and entry does not', function () {
            it('should return 404', function (done) {
                agent
                    .get('/entry/' + constants.KIND_EXIST + '/' + constants.ENTRY_ID_NOTEXIST)
                    .expect(404)
                    .expect('Content-Type', regJson)
                    .expect(/entry 0{23}1 not found/, done);
            });
        });

        describe('when kind does not exist', function () {
            it('should return 404', function (done) {
                agent
                    .get('/entry/' + constants.KIND_NOTEXIST + '/' + constants.ENTRY_ID_EXIST)
                    .expect(404)
                    .expect('Content-Type', regJson)
                    .expect(/kind kind2 not found/, done);
            });
        });

        describe('when entryId is not valid', function () {
            it('should return 400', function (done) {
                agent
                    .get('/entry/' + constants.KIND_EXIST + '/abc')
                    .expect(400)
                    .expect(/parameter entryId must be a valid ObjectID/, done)
            });
        });
    });
});
