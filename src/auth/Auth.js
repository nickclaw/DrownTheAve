var db = require('../database/Database'),
    passport = require('koa-passport');

module.exports = new Auth();

function Auth() {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.findById(id, done);
    });

    passport.use('facebook', require('./strategies/facebook'));
    passport.use('google', require('./strategies/google'));
    //passport.use('local', require('./strategies/local'));
}

Auth.prototype.middleware = function() {
    var auth = this;

    return function *(next) {
        this.auth = auth;
        yield next;
    }
}
