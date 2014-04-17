var express = require('express'),        // server
    mongoose = require('mongoose'),      // database
    compress = require('compression')(), // for serving static files
    favicon = require('static-favicon'), // for serving favicon
    bodyParser = require('body-parser'), // for parsing request json
    sass = require('node-sass'),         // for compiling sass
    jade = require('jade'),              // for compiling jade
    path = require('path'),              // for handling url paths
    em = require('express-mongoose');    // adds cool functions to express


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
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static', compress);
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('/api', bodyParser());

// add routes
require('./routers/pageRouter.js')(app);


/********* MONGOOSE *********/
mongoose.connect('mongodb://127.0.0.1');
mongoose.connection
    .on('error', function() {
        console.error('✗ mongoose could not connect.')
    })
    .on('open', function() {
        console.log('√ mongoose connected.');
    });

// start server
var server = app.listen(app.get('port'), function() {
    console.log('√ server listening on ' + server.address().port + '.');
});
