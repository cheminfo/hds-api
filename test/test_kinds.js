'use strict';

var request = require('supertest');
var hdsapi = require('..');
var hds = require('./hds');

var constants = require('./constants');

var regJson = /application\/json/;

describe('hds API', function () {

    describe('Parte 2!!!!!', function () {
        var app = hdsapi(hds);
        var agent = request.agent(app.callback());

        describe('create new entry', function () {
            it('should return ok', function (done) {
                agent
                    .post(constants.KIND_EXIST)
                    .field('data',constants.NEW_ENTRY_KINDEXIST)
                    .expect(200)
                    .expect('Content-Type', regJson)
                    .expect({status: 'created', entryID: '123'}, done);
            });
        });
    });
});
