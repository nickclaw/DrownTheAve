var koa = require('koa'),
    body = require('koa-body'),
    compress = require('koa-compress'),
    mount = require('koa-mount'),
    session = require('koa-session'),
    router = require('koa-router'),
    app = koa();

module.exports = router(app);

app.use(body());
app.use(compress());

app.post('/bars', function *(next) {
    this.body = yield this.db.getBars();
    yield next;
});
