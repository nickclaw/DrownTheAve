var koa = require('koa'),
    compress = require('koa-compress'),
    path = require('path'),
    serve = require('koa-static'),
    sass = require('koa-sass');


/**
 * Expose static files
 */
var app = module.exports = koa();

app.use(compress());
app.use(sass({
    src: path.join(__dirname, '../../../public/'),
    dest: path.join(__dirname, '../../../public/')
}))
app.use(serve(path.join(__dirname, '../../../public')));
