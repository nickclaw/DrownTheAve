var User = require('./models/User.js'),
    Bar = require('./models/Bar.js'),
    Special = require('./models/Special.js'),
    async = require('async'),
    Promise = require('mongoose').Promise;

// constants
var DEFAULT_DISTANCE = 1;
var THE_AVE = DEFAULT_LOCATION = [-122.313212, 47.658882];

var db = module.exports = {
    // expose our models
    User: User,
    Bar: Bar,
    Special: Special,

    /**
     * Retrieves all bars within a certain distance
     * @param {Object} options
     * @param {Array}      options.location [long, lat]
     * @param {Number}     options.distance (>0)
     * @param {Function?} callback
     * @return {Promise}
     */
    getBars: function(options, callback) {
        if (typeof options === 'function' || options === undefined) {
            callback = options;
            options = {};
        }

        var distance = options.distance || DEFAULT_DISTANCE,
            location = options.location || THE_AVE;

        Bar.geoNear(location, {
            maxDistance: distance,
            spherical: true,
            distanceMultiplier:
        }, callback);
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
        })
        .select({_id: 1})
        .exec(function(err, user) {
            callback(err, !!user);
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
     * @param {Object} options
     * @param {Date}       options.now
     * @param {Number}     options.year (>2000~)
     * @param {Number}     options.month (0-11)
     * @param {Number}     options.date (1-31)
     * @param {Number}     options.day (0-6)
     * @param {Array}      options.bars ids
     * @param {Number}     options.offset
     * @param {Number}     options.limit
     * @param {Function} callback
     * @return {Promise}
     */
    currentDeals: function(options, callback) {
        if (typeof options === 'function' || options === undefined) {
            callback = options;
            options = {};
        }

        var now = options.now || new Date(),
            year = options.year || now.getFullYear(),
            month = options.month || now.getMonth(),
            date = options.date || now.getDate(),
            day = options.day || now.getDay(),
            bars = options.bars || [],
            offset = options.offset || 0,
            limit = options.limit || 10;

        return Special
            .find({
                $and: [
                    {dates: {
                        $elemMatch: {$and:[
                            {$or: [{year: {$exists: false}}, {year: year}]},
                            {$or: [{month: {$exists: false}}, {month: month}]},
                            {$or: [{date: {$exists: false}}, {date: date}]},
                            {$or: [{day: {$exists: false}}, {day: day}]}
                        ]}
                    }},
                    {_bar_id: {$in: bars}}
                ]
            })
            .skip(offset)
            .limit(limit)
            .exec(callback);
    }

    /**
     * Gets all local bars and deals
     * @param {Object} options (inherited from getBars and currentDeals)
     * @param {Function} callback
     * @return {Promise}
     */
    localDeals: function(options, callback) {
        db.getBars(options, function(err, bars) {
            if (err) return callback(err);

            options.bars = bars.map(function(bar) {
                return bar.obj._id;
            });

            db.currentDeals(options, function(err, deals) {
                if (err) return callback(err);

                process.nextTick(function() {

                    // make barmap
                    var barMap = bars.reduce(function(hash, bar) {
                        var id = bar.obj._id;
                        hash[id] = bar.obj.toJSON();
                        hash[id].distance = bar.dis;
                        return hash;
                    }, {});

                    callback(null, {
                        bars: barMap,
                        deals: deals
                    });
                });
            });
        });
    }
}
