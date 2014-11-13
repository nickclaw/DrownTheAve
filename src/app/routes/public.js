var Router = require('koa-router'),
    router = new Router();

module.exports = router.middleware();

router.get('/', function *() {
    yield this.render('index', {
        user: this.passport.user
    });
});
