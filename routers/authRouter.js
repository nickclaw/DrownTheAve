var router = require('express').Router(),
    passport = require('passport'),
    util = require('./util.js');

router
    .get('/local', util.unauth, function(req, res) {
        res.render('login')
    })
    .get('/local/link', util.auth, passport.authenticate('local-login'))
    .post('/local', util.unauth, function(req, res, next) {

        // wrap passport.authenticate in a function
        // so we can dynamically set the successRedirect
        var target = req.query.target || '/';
        passport.authenticate('local-login', {
            successRedirect: target, //TODO check to make sure this is valid?
            failureRedirect: '/auth/local?target='+target
        })(req, res, next);
    })
;

router
    .get('/signup', util.unauth, function(req, res) {
        res.render('signup');
    })
    .post('/signup', util.unauth, passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/uhoh'
    }))
;

router
    .get('/google', util.unauth, passport.authenticate('google'))
    .get('/google/link', util.auth, passport.authenticate('google'))
    .get('/google/unlink', util.auth, unlink('_google_id'))
    .get('/google/return',
        passport.authenticate('google', {failureRedirect: '/uhoh'}),
        function(req, res) {
            res.redirect('/');
        }
    )
;

router
    .get('/facebook', util.unauth, passport.authenticate('facebook'))
    .get('/facebook/link', util.auth, passport.authenticate('facebook'))
    .get('/facebook/unlink', util.auth, unlink('_facebook_id'))
    .get('/facebook/return',
        passport.authenticate('google', {failureRedirect: '/uhoh'}),
        function(req, res) {
            res.redirect('/');
        }
    )
;

router.get('/logout', util.auth, function(req, res) {
    req.logout();
    res.direct('/');
});

module.exports = router;


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

        // make sure that some account is still linked before saving
        if (user._google_id || user._facebook_id || user.local.username) {
            user.save(function(err, user) {
                if (err) return next(err);
                res.send(user);
            });
        } else {
            user[id] = idValue;
            res.send({error: 'error'});
        }
    }
}
