var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {

    /**
     * Homepage
     */
    app.get('', isNew, function(req, res) {

        // (new db.Bar({
        //     name: "Finns",
        //     location: [-122, 47]
        // })).save(function(err, bar) {
        //     (new db.Special({
        //         _bar_id: bar._id,
        //         start: 0,
        //         end: 1000 * 60 * 60 * 24,
        //
        //         days: [0,1,2,3,4,5,6],
        //         dates: [new Date()],
        //
        //         deal: "Testing"
        //     })).save(function() {
        //         console.log(arguments);
        //     });
        // });

        res.render('home', {
            user: req.user,
            bars: db.getBars(req),
            specials: db.currentDeals()
        });
    });

    app.get('/welcome', util.auth, function(req, res) {

        req.user.profile.new = false;

        res.render('welcome', {
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
}
