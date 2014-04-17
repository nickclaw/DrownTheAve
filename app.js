// get modules
var express = require('express');

// get routes
var pageRouter = require('./routers/pageRouter.js');

// initialize app
var app = express();

pageRouter(app);

// start server
var server = app.listen(8080, function() {
    console.log('Server listening on ' + server.address().port);
});
