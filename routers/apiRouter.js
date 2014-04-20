var Bar = require('../models/Bar.js'),
    theAve = [-122.313212, 47.658882];

module.exports = function(app, passport) {

    /**
     * Retrieves all bars within a certain distance
     * @param {Number} distance defaults to 1 mile
     * @param {Array} lat/long defaults to the ave
     * @return {Array} of bars within range
     */
    app.get('/api/getBars', function(req, res) {
        if (req.query.distance) req.session.distance = req.query.distance;
        if (req.query.location) req.session.location = req.query.location;

        var distance = req.session.distance || 1,
        var location = req.session.location ||
                (req.user ? req.user.location : undefined) || theAve;

        Bar.find({
            location: {
                $geoWithin: {
                    $center: [location, distance]
                }
            }
        }).exec(function(err, bars){
            console.log(err, bars);
            res.send(bars);
        });

    });

}
