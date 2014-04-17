// get modules
var express = require('express'),
    compress = require('compression')(),
    favicon = require('static-favicon'),
    bodyParser = require('body-parser'),
    sass = require('node-sass'),
    jade = require('jade'),
    path = require('path');

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

// start server
var server = app.listen(app.get('port'), function() {
    console.log('Server listening on ' + server.address().port);
});
