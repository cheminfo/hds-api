'use strict';

var request = require('supertest');
var hdsapi = require('../../');
var hds = require('hds');
var Kind = hds.Kind;

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

    agent.post('/entry/experiment')
        .send({name:'myExperiment1',id:'def456'})
        .expect(200)
        .expect('Content-Type', regJson)
        .end(function (err, res) {
            if (err) throw err;
            var ans = (res.body.status == 'created');
            if (ans) console.log('created');
            // (res.body.entryID == 'uuid');
            console.log(ans);
        });

    agent.get('/entry/experiment/55e9b0b5867a77ee20623bdb')
        .expect(200)
        .expect('Content-Type', regJson)
        .end(function (err, res) {
            if (err) throw err;
            var ans = (res.body._id == '55e9b0b5867a77ee20623bdb');
            ans = ans && (res.body.name == 'myExperiment');
            if (ans) console.log('query success');
            process.exit(0);
        });
}

function onError(e) {
    console.error(e);
    process.exit(1);
}

