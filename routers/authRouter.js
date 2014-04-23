var util = require('./util.js');

module.exports = function(app, passport) {

    /******* LOCAL *******/
    // login
    app.get('/auth/local', function(req, res) {
        res.render('login');
    });
    app.post('/auth/local/link', util.auth, passport.authenticate('local-login'));
    app.post('/auth/local', util.unauth, function(req, res, next) {
        // wrap passport.authenticate in a function
        // so we can dynamically set the successRedirect
        var target = req.query.target || '/';
        passport.authenticate('local-login', {
            successRedirect: target, //TODO check to make sure this is valid?
            failureRedirect: '/auth/local?target='+target
        })(req, res, next);
    });

    // signup
    app.get('/auth/signup', util.unauth, function(req, res) {
        res.render('signup');
    });
    app.post('/auth/signup', util.unauth, passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));


    /******* GOOGLE *******/
    app.get('/auth/google', util.unauth, passport.authenticate('google'));
    app.get('/auth/google/link', util.auth, passport.authenticate('google'));
    app.get('/auth/google/return',
        passport.authenticate('google', {failureRedirect: '/uhoh'}),
        function(req, res) {
            res.redirect('/');
        }
    );

    /******* LOGOUT *******/
    app.get('/auth/logout', util.auth, function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
