var User = require('./models/User.js'),
    Bar = require('./models/Bar.js');

// constants
var DEFAULT_DISTANCE = 1;
var THE_AVE = DEFAULT_LOCATION = [-122.313212, 47.658882];

module.exports = {
    // expose our models
    User: User,
    Bar: Bar,

    /**
     * Retrieves all bars within a certain distance
     * @param {Request} request to extract options from
     * @param {Function?} callback
     * @return {Promise}
     */
    getBars: function(req, callback) {
        var distance = req.session.distance || DEFAULT_DISTANCE;
        var location = req.session.location ||
                (req.user ? req.user.location : undefined) || THE_AVE;

        return Bar.find({
            location: {
                $geoWithin: {
                    $center: [location, distance]
                }
            }
        }).exec(callback);
    }
}
