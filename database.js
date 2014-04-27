var User = require('./models/User.js'),
    Bar = require('./models/Bar.js'),
    Special = require('./models/Special.js'),
    async = require('async'),
    Promise = require('mongoose').promise;

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
     * @param {Object} options
     * @param {Function?} callback
     * @return {Promise}
     */
    getBars: function(options, callback) {
        if (typeof options === 'function' || options === undefined) {
            callback = options;
            options = {};
        }

        var select = options.select || false,
            distance = options.distance || DEFAULT_DISTANCE,
            location = options.location || THE_AVE;

        var query = Bar
            .find({
                location: {
                    $geoWithin: {
                        $center: [location, distance]
                    }
                }
            });

        if (select) {
            query.select(select);
        }

        return query.exec(callback);
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
    currentDeals: function(options, callback) {
        if (typeof options === 'function' || options === undefined) {
            callback = options;
            options = {};
        }

        var promise = new Promise(),
            now = options.now || new Date(),
            year = options.year || now.getFullYear(),
            month = options.month || now.getMonth(),
            date = options.date || now.getDate(),
            day = options.day || now.getDay(),
            location = options.location || THE_AVE,
            distance = options.distance || DEFAULT_DISTANCE;

        this.getBars({
            select: '_id',
            location: location,
            distance: distance
        }, function(err, bars)) {
            Special
                .find({
                    $or: [
                        {dates: {
                            $elemMatch: {$and:[
                                {$or: [{year: {$exists: false}}, {year: year}]},
                                {$or: [{month: {$exists: false}}, {month: month}]},
                                {$or: [{day: {$exists: false}}, {day: date}]},
                            ]}
                        }},
                        {days: day},
                        {_bar_id: {$in: bars}}
                    ]
                })
                .populate('_bar_id')
                .exec(promise.resolve);
        }

        return promise;
    }
}
