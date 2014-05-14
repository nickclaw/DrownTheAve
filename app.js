var express = require('express'),            // server
    mongoose = require('mongoose'),          // database
    passport = require('passport'),          // sign in
    compress = require('compression'),       // for serving static files
    favicon = require('static-favicon'),     // for serving favicon
    bodyParser = require('body-parser'),     // for parsing request json
    cookieParser = require('cookie-parser'), // for cookies
    session = require('cookie-session'),     // stores storing session info in cookies
    sass = require('node-sass'),             // for compiling sass
    jade = require('jade'),                  // for compiling jade
    em = require('express-mongoose'),        // adds cool functions to express
    path = require('path'),                  // util for handling url paths
    async = require('async');                // util for asynchronous flow


/********* ENV *********/
require('./config/env.js')();


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
    outputStyle: 'compressed',
    force: true
}));
app.use(bodyParser());
app.use(cookieParser()); // cookie must be before session
app.use(session({ // session must be before passport
    key: 'drowntheave',
    secret: 'thisissupertopsecret',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 14}
}));
app.use(compress());
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));


/********* PASSPORT ********/
// configure passport
require('./config/passport.js')(passport);

// add passport middleware
app.use(passport.initialize());
app.use(passport.session());


/********* ROUTES *********/
require('./routers/pageRouter.js')(app, passport);
require('./routers/authRouter.js')(app, passport);
require('./routers/apiRouter.js')(app, passport);
require('./routers/adminRouter.js')(app, passport);
app.use('/static', express.static(path.join(__dirname, 'public')));

// 404 error handler
// has to be the last app.use statement
app.use(function(req, res) {
    res.status(404);
    res.render('error', {
        code: 404,
        message: 'That page could not be found.'
    });
});


/***** START *****/
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
