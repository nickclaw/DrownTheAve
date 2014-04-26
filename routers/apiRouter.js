var db = require('../database.js');

module.exports = function(app, passport) {

    /**
     * Retrieves all bars within a certain distance
     * @param {Number} distance defaults to 1 mile
     * @param {Array} lat/long defaults to the ave
     * @return {Array} of bars within range
     */
    app.get('/api/getBars', function(req, res) {

        // update session with query results
        if (req.query.distance) req.session.distance = req.query.distance;
        if (req.query.location) req.session.location = req.query.location;

        db.getBars(req, function(err, bars) {
            if (err) return res.send('error');
            res.send(bars);
        });
    });

    app.get('/api/getSpecials', function(req, res) {
        db.currentDeals(function(err, deals) {
            res.send(deals);
        });
    });
}
