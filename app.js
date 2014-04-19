var express = require('express'),        // server
    mongoose = require('mongoose'),      // database
    compress = require('compression'),   // for serving static files
    favicon = require('static-favicon'), // for serving favicon
    bodyParser = require('body-parser'), // for parsing request json
    cookie = require('cookie-parser'),   // for cookies
    session = require('express-session'),// for staying signed in
    sass = require('node-sass'),         // for compiling sass
    jade = require('jade'),              // for compiling jade
    em = require('express-mongoose'),    // adds cool functions to express
    path = require('path'),              // UTIL for handling url paths
    async = require('async'),            // UTIL for asynchronous flow

    // sign in
    passport = require('passport');


/********* EXPRESS *********/
// initialize app
var app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// add middleware
app.use('/static/styles', sass.middleware({
    src: path.join(__dirname, 'public/styles/scss'),
    dest: path.join(__dirname, 'public/styles'),
    outputStyle: 'compressed'
}));
app.use(cookie()); // cookie must be before session
app.use(session({ // session must be before passport
    secret: 'TOP_SECRET',
    key: 'sid',
    cookie: {secure: true}
}));
app.use(compress());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('', bodyParser());


/********* PASSPORT ********/
// configure passport
require('./config/passport.js')(passport);

// add passport middleware
app.use(passport.initialize());
app.use(passport.session());


/********* ROUTES *********/
require('./routers/pageRouter.js')(app, passport);
require('./routers/authRouter.js')(app, passport);


/***** START *****/
async.parallel([

    // start mongoose
    function(callback) {
        mongoose.connect('mongodb://127.0.0.1', function(err) {
            if (!err) {
                var db = mongoose.connection.db,
                    name = db.databaseName,
                    loc = db.serverConfig.name;

                console.log('√ mongoose connected to: ' + name + '@' + loc);
            }
            callback(err);
        });
    },

    // start server
    function(callback) {
        var server = app.listen(app.get('port'), function(err) {
            if (!err) {
                var port = server.address().port;

                console.log('√ server listening on port: ' + port);
            }
            callback(err);
        });
    }
], function(err) {
    if (err) return console.error(err);
    console.log('√ successfully running.');
});
