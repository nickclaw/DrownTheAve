var mongoose = require('mongoose'),
    Bar = require('./Bar.js'),
    bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({

    // accounts
    _twitter_id: String,
    _facebook_id: String,
    _google_id: String,
    local: {
        username: String,
        password: String
    },

    // user information
    profile: {
        firstName: String,
        lastName: String,
        email: String,
        picture: String
    },
    location: {
        type: [Number],
        index: '2dsphere'
    }
});

/* If the password was changed, then it's currently
 * plaintext. Hash it before we save.
 */
userSchema.pre('save', function(next) {
    if (this.local.password && this.isModified('local.password')) {
        this.local.password = bcrypt.hashSync(this.local.password, 10);
    }
    next();
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

/**
 * Returns true if the password matches the hashed password
 * @param {String} unhashed password
 * @return {Boolean}
 */
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', userSchema);
