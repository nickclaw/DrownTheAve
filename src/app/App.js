var koa = require('koa'),
    favicon = require('koa-favicon'),
    path = require('path'),
    db = require('../database/Database'),
    auth = require('../auth/Auth'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    mount = require('koa-mount');

// routes
var staticRoutes = require('./routes/static'),
    apiRoutes = require('./routes/api'),
    publicRoutes = require('./routes/public');

module.exports = new App();

function App() {
    var app = this.app = koa();

    // debugging
    app.use(function *(next) {
        var start = Date.now();

        yield next;

        console.log("\n");
        console.log(this.request.method + ' ' + this.originalUrl + ' => ' + this.response.status + ' ' + this.response.message);
        console.log(Date.now() - start + 'ms');
    });

    app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
    app.use(db.middleware());
    app.use(auth.middleware());

    app.use(mount('/static', staticRoutes));
    app.use(mount('/api', apiRoutes));
    //app.use(mount(publicRoutes));
}

App.prototype.start = function(options) {
    options = _.extend({
        port: 8080
    }, options);

    return Promise.try(this.app.listen, [options.port], this.app)
        .then(function() {
            console.log('√ koa running on port ' + options.port);
        });
}
