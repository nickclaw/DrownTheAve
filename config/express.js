var statics = require('express').static,
    compress = require('compression'),       // for serving static files
    favicon = require('static-favicon'),     // for serving favicon
    bodyParser = require('body-parser'),     // for parsing request json
    cookieParser = require('cookie-parser'), // for cookies
    session = require('cookie-session'),     // stores storing session info in cookies
    path = require('path'),                  // util for handling url paths
    sass = require('node-sass-middleware'),  // for compiling sass
    router = require('../routers/router.js');

module.exports = function(app, passport) {
    app.set('port', process.env.PORT || 8080);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    // communication/storage
    app.use(compress());
    app.use(bodyParser());
    app.use(cookieParser()); // cookie must be before session
    app.use(session({ // session must be before passport
        key: 'drowntheave',
        secret: 'thisissupertopsecret',
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 14}
    }));

    // security
    app.use(passport.initialize());
    app.use(passport.session());

    // routes
    app.use('/static/style', sass({
        src: path.join(__dirname, '../public/style'),
        dest: path.join(__dirname, '../public/style'),
        outputStyle: 'compressed',
        force: true
    }));
    app.use('/static', statics(path.join(__dirname, '../public')));
    app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
    app.use('', router);
}
