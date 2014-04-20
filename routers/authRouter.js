
module.exports = function(app, passport) {

    /******* LOCAL *******/
    // login
    app.get('/auth/login', function(req, res) {
        res.render('login');
    });
    app.post('/auth/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));

    // signup
    app.get('/auth/signup', function(req, res) {
        res.render('signup');
    });
    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));



    /******* LOGOUT *******/
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
