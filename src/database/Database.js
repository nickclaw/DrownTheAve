var _ = require('lodash'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

// models
var Bar = require('./models/Bar'),
    User = require('./models/User'),
    Special = require('./models/Special');

mongoose.plugin(timestamps, {
    createdAt: 'created',
    updatedAt: 'updated'
});

module.exports = new Database();

function Database() {
    this.Bar = Bar;
    this.User = User;
    this.Special = Special;
}

/**
 * Starts the mongoose connection
 * @param {Object} options
 * @return {Promise}
 */
Database.prototype.start = function(options) {
    options = _.extend({
        url: "",
        user: undefined,
        pass: undefined,
        auth: undefined
    }, options)

    return Promise.try(mongoose.connect, [options.url, options], mongoose)
    .then(function(mongoose) {
        var db = mongoose.connection.db,
            name = db.databaseName,
            loc = db.serverConfig.name;

        console.log('√ mongoose connected to: ' + name + '@' + loc);
    });
}

/**
 * Returns koa middleware
 * @return {Generator}
 */
Database.prototype.middleware = function() {
    var database = this;

    return function *(next) {
        this.db = database;
        yield next
    }
}

/**
 * Gets bars within a range
 * @param {Object} options
 * @return {Promise}
 */
Database.prototype.getBars = function getBars(options) {
    options = _.extend({
        distance: 1,
        location: [-122.313212, 47.658882] // TODO constants
    }, options);

    return Promise.resolve(
        this.Bar.geoNear(options.location, {
            maxDistance: options.distance,
            spherical: true
        })
    );
}

/**
 * Gets the specials of a given time
 * Defaults to current time
 *
 * @param {Object} options
 * @return {Promise}
 */
Database.prototype.getSpecials = function(options) {
    options = options || {};
    var now = options.now || new Date(),
        year = options.year || now.getFullYear(),
        month = options.month || now.getMonth(),
        date = options.date || now.getDate(),
        day = options.day || now.getDay(),
        bars = options.bars || [],
        offset = options.offset || 0,
        limit = options.limit || 10;

    return Promise.resolve(
        this.Special.find({
            $and: [
                {dates: {
                    $elemMatch: {$and:[
                        {$or: [{year: {$exists: false}}, {year: options.year}]},
                        {$or: [{month: {$exists: false}}, {month: options.month}]},
                        {$or: [{date: {$exists: false}}, {date: options.date}]},
                        {$or: [{day: {$exists: false}}, {day: options.day}]}
                    ]}
                }},
                {_bar_id: {$in: options.bars}}
            ]
        })
        .skip(options.offset)
        .limit(options.limit)
        .exec()
    );
}

Database.prototype.getLocalSpecials = function(options) {
    var db = this;

    return db.getBars(options)
        .then(function(bars) {
            options.bars = _.pluck(bars, '_id');
            return db.getSpecials(options);
        })
        .then(function(deals) {

        });
}

/**
 * Add simple CRUD for the models
 */
_.each(["Bar", "Special", "User"], function(model) {

    /**
     * Retrieve a model
     * @param {String} id
     * @return {Promise}
     */
    Database.prototype['get' + model] = function(id) {
        return Promise.resolve(
            this[model].findById(id).exec()
        )
    }

    /**
     * Delete a model
     * @param {String} id
     * @return {Promise}
     */
    Database.prototype['delete' + model] = function(id) {
        return Promise.resolve(
            this[model]
                .findByIdAndRemove(id)
                .exec()
        );
    }

    /**
     * Update a model, only changing given parameters
     * @param {String} id
     * @return {Promise}
     */
    Database.prototype['update' + model] = function(id, data) {
        return Promise.resolve(
            this[model]
                .findByIdAndUpdate(id, {$set: data})
                .exec()
        );
    }

    /**
     * Create a model
     * @param {String} id
     * @return {Promise}
     */
    Database.prototype['create' + model] = function(data) {
        return Promise.resolve(
            this[model].create(data)
        );
    }

});
