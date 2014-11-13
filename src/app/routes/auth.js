var Router = require('koa-router'),
    auth = require('../../auth/Auth')
    router = new Router(),
    passport = require('passport');

router.get('/google', passport.authenticate('google'));

router.get('/google/return', passport.authenticate('google', {
    successRedirect: '/#!/welcome',
    failureRedirect: '/uhoh'
}));

module.exports = router.middleware();
