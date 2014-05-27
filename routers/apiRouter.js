var router = require('express').Router(),
    db = require('../database.js'),
    util = require('./util.js');

router
    .get('/getBars', function(req, res) {

        // update session with query results
        if (req.query.distance) req.session.distance = req.query.distance;
        if (req.query.location) req.session.location = req.query.location;

        db.getBars(req, function(err, bars) {
            if (err) return res.send('error');
            res.send(bars);
        });
    })
    .get('/getSpecials', function(req, res) {
        db.currentDeals({
            // options
        }, function(err, deals) {
            res.send(deals);
        });
    })

module.exports = router;
