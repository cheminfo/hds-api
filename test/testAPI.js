'use strict';

var request = require('supertest');
var hdsapi = require('../src/index');
var hds = require('hds');
var Kind = hds.Kind;

var regJson = /application\/json/;

// Load kinds
require('./kinds_metabo');

var connection = hds.init({
    database: require('./mongo.json')
});

connection.then(onSuccess, onError);

function onSuccess() {
    //getChildren
    var app = hdsapi(hds);
    var agent = request.agent(app.callback());
    agent.get('/kind/_list/all')
        .expect(200)
        .expect('Content-Type', regJson)
        .end(function (err, res) {
            if (err) throw err;
            console.log('got it:',JSON.stringify(res.body));
        });
    /*
    agent.post('/entry/project/_find')
        .send({query: {},includeChildren:2, childrenKind:"patient"})
        .expect(200)
        .expect('Content-Type', regJson)
        .end(function (err, res) {
            if (err) throw err;
            console.log('got it:',JSON.stringify(res.body));
        });
    */

    // creates a kind
   /* agent.post('/kind/_new/catalogEntry')
        .send({
            id: {
                type: 'string',
                required: true
            },
            name: 'string',
            cat: ['string']
        })
        .expect(200)
        .expect('Content-Type', regJson)
        .end(function (err, res) {
            if (err) throw err;
            var ans = (res.body.status == 'created');
            if (ans) console.log('created with id:', res.body.kindID);
        });*/
}

function onError(e) {
    console.error(e);
    process.exit(1);
}

/*
 // creates an entry
 agent.post('/entry/experiment')
 .send({name:'myExperiment1',id:'def456'})
 .expect(200)
 .expect('Content-Type', regJson)
 .end(function (err, res) {
 if (err) throw err;
 var ans = (res.body.status == 'created');
 if (ans) console.log('created with id:', res.body.entryID);
 });

 // query entry
 agent.post('/entry/experiment/_find')
 .send({query: {id: 'def456'}})
 .expect(200)
 .expect('Content-Type', regJson)
 .end(function (err, res) {
 if (err) throw err;
 console.log('got it:',res.body);
 });

 // change entry
 agent.put('/entry/experiment/'+res.body.entryID)
 .send({name:'myExperiment2',id:'ghi789'})
 .expect(200)
 .expect('Content-Type', regJson)
 .end(function (err, res) {
 if (err) throw err;
 var ans = (res.body.status == 'modified');
 if (ans) console.log('modified');
 });

 // delete entry
 agent.delete('/entry/experiment/'+res.body.entryID)
 .expect(200)
 .expect('Content-Type', regJson)
 .end(function (err, res) {
 if (err) throw err;
 var ans = (res.body.status == 'deleted');
 if (ans) console.log('deleted');
 });

 // simple query
 agent.get('/entry/experiment/55e9b0b5867a77ee20623bdb')
 .expect(200)
 .expect('Content-Type', regJson)
 .end(function (err, res) {
 if (err) throw err;
 var ans = (res.body._id == '55e9b0b5867a77ee20623bdb');
 ans = ans && (res.body.name == 'myExperiment');
 if (ans) console.log('query success:', res.body);
 });
 */