var router = require('express').Router(),
    db = require('../database.js'),
    util = require('./util.js');

router
    .get('', isNew, function(req, res) {
        res.render('home', {
            user: req.user,
            bars: db.getBars(req),
            specials: db.currentDeals()
        });
    })
    .get('/welcome', util.auth, function(req, res) {

        req.user.profile.new = false;

        res.render('welcome', {
            user: req.user,
            bars: []
        });

        req.user.save(function(err) {
            if (err) console.error(err);
        });
    })
;

module.exports = router;


/**
 * Redirects new users to the welcome page
 */
function isNew(req, res, next) {
    if (req.user && req.user.profile.new) {
        res.redirect('/welcome')
    } else {
        next();
    }
}
