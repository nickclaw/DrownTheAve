var util = require('./util.js'),
    User = require('./models/Bar.js');

module.exports = function(app, passport) {

    /******* LOCAL *******/
    // login
    app.get('/auth/local', function(req, res) {
        res.render('login');
    });
    app.get('/auth/local/link', util.auth, passport.authenticate('local-login'));
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

    /******** FACEBOOK ********/
    app.get('/auth/facebook', util.unauth, passport.authenticate('facebook'));
    app.get('/auth/facebook/link', util.auth, passport.authenticate('facebook'));
    app.get('/auth/faceboo/return',
        passport.authenticate('google', {failureRedirect: '/uhoh'}),
        function(req, res) {
            res.redirect('/');
        }
    );

    /******* UNLINK *******/

    /**
     * Generates a router function to unlink stuff
     * @param {String} id the id to unlink
     * @return {Function}
     */
    function unlink(id){
        return function(req, res, next){
            var user = req.user,
                idValue = user[id];

            user[id] = undefined;

            if (req.user._google_id || req.user._facebook_id || req.user.local) {
                req.user.save(function(err, user) {
                    if (err) return next(err);
                    res.send(user);
                });
            } else {
                user[id] = idValue;
                res.send({error: 'error'});
            }
        }
    }

    app.get('/auth/google/unlink', util.auth, unlink('_google_id'));
    app.get('/auth/facebook/unlink', util.auth, unlink('_facebook_id'));
    app.get('/auth/twitter/unlink', util.auth, unlink('_twitter_id'));

    /******* LOGOUT *******/
    app.get('/auth/logout', util.auth, function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
