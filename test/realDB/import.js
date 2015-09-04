'use strict';

var fs = require('fs');
var hds = require('hds');
var Entry = hds.Entry;

// Load kinds
require('./kinds');

var connection = hds.init({
    database: require('./mongo.json')
});

connection.then(onSuccess, onError);

function onSuccess() {
    hds.dropDatabase().then(startImport);
}

function onError(e) {
    console.error(e);
    process.exit(1);
}

function startImport() {

    var experiment = Entry.create('experiment', {
        _id:"55e9b0b5867a77ee20623bdb",
        id: 'abc123'
    }, {
        owner: 'test@cheminfo.org'
    });

    experiment.name = 'myExperiment';

    experiment.save().then(saveNmr);

    function saveNmr() {

        var file1 = './data/nmr1.jdx';
        var nmr1 = experiment.createChild('nmr', {
            solv: 'Ethanol',
            freq: 400,
            jcamp: {
                value: fs.readFileSync(file1),
                filename: 'nmr1.jdx'
            }
        });

        var file2 = './data/nmr2.jdx';
        var nmr2 = experiment.createChild('nmr', {
            solv: 'Ethanol',
            freq: 400,
            jcamp: {
                value: fs.readFileSync(file2),
                filename: 'nmr2.jdx'
            }
        });

        var saveChildren = [nmr1.save(), nmr2.save()];
        console.log(Promise);
        Promise.all(saveChildren)
            .then(function () {
                console.log('Everything saved');
                process.exit(0);
            });

    }

}

