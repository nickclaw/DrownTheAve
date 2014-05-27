var express = require('express'),            // server
    mongoose = require('mongoose'),          // database
    passport = require('passport'),          // sign in
    async = require('async');                // util for asynchronous flow

// initialize things
var app = express();
require('./config/env.js')();
require('./config/passport.js')(passport);
require('./config/express.js')(app, passport);
require('./config/mongoose.js')(mongoose);

// start
async.parallel([

    // start mongoose
    function(next) {
        mongoose.connect('mongodb://127.0.0.1/drowntheave', function(err) {
            if (!err) {
                var db = mongoose.connection.db,
                    name = db.databaseName,
                    loc = db.serverConfig.name;

                console.log('√ mongoose connected to: ' + name + '@' + loc);
            }
            next(err);
        });
    },

    // start server
    function(next) {
        var server = app.listen(app.get('port'), function(err) {
            if (!err) {
                var port = server.address().port;

                console.log('√ server listening on port: ' + port);
            }
            next(err);
        });
    }
], function(err) {
    if (err) return console.error(err);
    console.log('√ successfully running.');
});
