'use strict';

var koa = require('koa');
var request = require('supertest');
var hdsapi = require('..');
var hds = require('./hds');

var regJson = /application\/json/;

describe('hds API', function () {

    describe('getting single entries', function () {
        var app = koa();
        hdsapi(app, hds);
        var agent = request.agent(app.callback());
        describe('when kind and entry both exists', function () {
            it('should return the entry', function (done) {
                agent
                    .get('/entry/kind1/id1')
                    .expect(200)
                    .expect('Content-Type', regJson)
                    .expect({_id:'id1', field1:'hello'}, done);
            });
        });
        describe('when kind exists and entry does not', function () {
            it('should return 404', function (done) {
                agent
                    .get('/entry/kind1/id2')
                    .expect(404)
                    .expect('Content-Type', regJson)
                    .expect(/entry id2 not found/, done);
            });
        });
        describe('when kind does not exist', function () {
            it('should return 404', function (done) {
                agent
                    .get('/entry/kind2/id1')
                    .expect(404)
                    .expect('Content-Type', regJson)
                    .expect(/kind kind2 not found/, done);
            });
        });
    });

});
