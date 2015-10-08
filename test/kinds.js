'use strict';

var hds = require('hds');
var Kind = hds.Kind;

Kind.create('experiment', {
    id: String,
    keywords: [String],
    name: String
});

var jcamp = new Kind.File({
    filename: 'nmr.jdx',
    mimetype: 'chemical/x-jcamp-dx'
});

Kind.create('nmr', {
    solv: String,
    freq: Number,
    jcamp: jcamp
});

