var koa = require('koa'),
    compress = require('koa-compress'),
    path = require('path'),
    serve = require('koa-static');


/**
 * Expose static files
 */
var app = module.exports = koa();

app.use(compress());
app.use(serve(path.join(__dirname, '../../../public')));
