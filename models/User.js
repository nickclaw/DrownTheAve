var mongoose = require('mongoose'),
    Bar = require('./Bar.js');

var userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    location: {
        type: [Number],
        index: '2dsphere'
    }
});

/**
 * Gets all bars within a given distance
 * @param {Number} distance defaults to 1
 * @param {Array?} location
 * @param {Function} callback
 * @return {Promise}
 */
userSchema.methods.getBars = function(distance, location, callback) {
    // make location optional
    if (typeof location === 'function') {
        callback = location;
        location = this.location;
    }

    console.log(location);

    // http://docs.mongodb.org/manual/reference/operator/query/center/
    // run query, return Promise
    return Bar.find({
        location: {
            $geoWithin: {
                $center: [location, distance]
            }
        }
    }).exec(callback);
}

module.exports = mongoose.model('User', userSchema);
