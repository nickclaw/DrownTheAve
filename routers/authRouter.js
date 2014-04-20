
module.exports = function(app, passport) {

    /******* LOCAL *******/
    // login
    app.get('/auth/login', function(req, res) {
        res.render('login');
    });
    app.post('/auth/login', function(req, res, next) {
        // wrap passport.authenticate in a function
        // so we can dynamically set the successRedirect
        var target = req.query.target || '/';
        passport.authenticate('local-login', {
            successRedirect: target, //TODO check to make sure this is valid?
            failureRedirect: '/auth/login?target='+target
        })(req, res, next);
    });

    // signup
    app.get('/auth/signup', function(req, res) {
        res.render('signup');
    });
    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));


    /******* LOCAL *******/
    app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google/return',
        passport.authenticate('google', {failureRedirect: '/uhoh'}),
        function(req, res) {
            res.redirect('/');
        }
    );

    /******* LOGOUT *******/
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
