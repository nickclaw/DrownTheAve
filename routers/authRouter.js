module.exports = function(app, passport) {

    app.get('/auth/login', function(req, res) {
        res.render('login');
    });

    app.post('/auth/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));

    app.get('/auth/signup', function(req, res) {
        res.render('signup');
    });

    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }));
}
