'use strict';

var request = require('supertest');
var hdsapi = require('../src/index');
var hds = require('hds');
var Kind = hds.Kind;

var regJson = /application\/json/;

function onError(e) {
    console.error(e);
    process.exit(1);
}

describe('hds API', function () {

    describe('getting single entries', function () {
        var connection = hds.init({
            database: require('./mongo.json')
        });

        it('should return the entry', function (done) {
            connection.then(onSuccess, onError);

            function onSuccess() {
                var app = hdsapi(hds);
                var agent = request.agent(app.callback());

                // simple query
                agent.get('/entry/experiment/55e9b0b5867a77ee20623bdb')
                    .expect(200)
                    .expect('Content-Type', regJson)
                    .end(function (err, res) {
                        if (err) throw err;
                        var ans = (res.body._id == '55e9b0b5867a77ee20623bdb');
                        ans = ans && (res.body.name == 'myExperiment');
                        (ans).should.not.be.false();
                        process.exit(0);
                        done();
                    });
            }
        });
    });
});
