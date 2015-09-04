/**
 * Created by acastillo on 9/4/15.
 */
'use strict';

var request = require('supertest');
var hdsapi = require('../../');
var hds = require('hds');
var Kind = hds.Kind;

//var constants = require('../constants');

var regJson = /application\/json/;

// Load kinds
require('./kinds');

var connection = hds.init({
    database: require('./mongo.json')
});

connection.then(onSuccess, onError);

function onSuccess() {
    var app = hdsapi(hds);
    var agent = request.agent(app.callback());
    //console.log(Kind);
    //console.log(hds);

    agent.get('/entry/experiment/55e9b0b5867a77ee20623bdb')
        .expect(200)
        .expect('Content-Type', regJson)
        .expect({_id:'55e9b0b5867a77ee20623bdb', name:'myExperiment'}, function(ok){
            console.log("Ok "+ ok);
            process.exit(0);
        });

    //console.log(result);

    //process.exit(0);

    /*describe('hds API', function () {

        describe('getting single entries', function () {
            var app = hdsapi(hds);
            var agent = request.agent(app.callback());
            console.log(Kind);
            console.log(hds);
            describe('when kind and entry both exists', function () {
                it('should return the entry', function (done) {
                    agent
                        .get('/entry/' +  + '/' + constants.ENTRY_ID_EXIST)
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
    });*/
}

function onError(e) {
    console.error(e);
    process.exit(1);
}

