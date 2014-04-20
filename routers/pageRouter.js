var db = require('../database.js');

module.exports = function(app, passport) {

    /**
     * Homepage
     */
    app.get('', isNew, function(req, res) {

        res.render('home', {
            user: req.user,
            bars: db.getBars(req)
        });
    });

    app.get('/welcome', isAuthenticated, function(req, res) {

        req.user.profile.new = false;

        res.render('home', {
            user: req.user,
            bars: []
        });

        req.user.save(function(err) {
            if (err) console.error(err);
        });
    });

    /* Intercepts requests to the front page if the user is new
     * Redirect user to the welcome page
     */
    function isNew(req, res, next) {
        if (req.user && req.user.profile.new) {
            res.redirect('/welcome')
        } else {
            next();
        }
    }

    /* Intercepts unauthenticated users and redirects them to
     * the login page
     */
    function isAuthenticated(req, res, next) {
        if (req.user) return next();
        res.redirect('/auth/login?target='+req.path);
    }
}
