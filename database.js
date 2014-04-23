var User = require('./models/User.js'),
    Bar = require('./models/Bar.js'),
    Special = require('./models/Special.js'),
    async = require('async');

// constants
var DEFAULT_DISTANCE = 1;
var THE_AVE = DEFAULT_LOCATION = [-122.313212, 47.658882];

module.exports = {
    // expose our models
    User: User,
    Bar: Bar,
    Special: Special,

    /**
     * Retrieves all bars within a certain distance
     * @param {Request} req request to extract options from
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
    },

    /**
     * Checks to make sure a username is unique
     * @param {String} username
     * @param {Function} callback
     * @return {Promise}
     */
    uniqueUsername: function(username, callback) {
        return User.find({
            "local.username": username
        }).exec(function(err, user) {
            if (err) return callback(err);
            callback(null, !!user);
        });
    },

    /**
     * Links two accounts
     * @param {User} current primary user
     * @param {User} other linked user
     * @param {Function} linked
     */
    linkAccounts: function(current, other, callback) {

        // link the two users
        current.link(other, function(err, model) {

            async.parallel([

                // save the current user
                function(next) {
                    model.save(next);
                },

                // delete the old user
                function(next) {
                    other.remove(next);
                }
            ], function(err) {
                if (err) return callback(err);
                callback(err, model);
            });
        });
    },

    /**
     * Get all current deals
     * @param {Function} callback
     * @return {Promise}
     */
    currentDeals: function(callback) {
        var mpd = 1000 * 60 * 60 * 24,
            now = new Date();

        // round today down
        now.setHours(0);
        now.setSeconds(0);
        now.setMinutes(0);
        now.setHours(0);

        return Special.find({$or: [
                {days: now.getDay()},
                {dates: now}
            ]})
            .populate('_bar_id')
            .exec(callback);
    }
}
