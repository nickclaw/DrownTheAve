var mongoose = require('mongoose'),
    Bar = require('./Bar.js'),
    bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({

    // accounts
    _twitter_id: String,  // unused
    _facebook_id: String, // unused
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
 * Returns true if the password matches the hashed password
 * @param {String} unhashed password
 * @return {Boolean}
 */
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', userSchema);
