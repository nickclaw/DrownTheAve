var async = require('async'),
    mongoose = require('mongoose'),
    Bar = require('./models/Bar.js');

var bars = require('./data/bars.json').data;

mongoose.connect('mongodb://127.0.0.1/drowntheave', function(err) {
    if (err) throw err;

    Bar.create(bars, function(err, bars) {
        console.log(arguments);
    });

});
