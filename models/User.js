var mongoose = require('mongoose'),
    Bar = require('./Bar.js'),
    bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({

    // accounts
    _twitter_id: {type: String, unique: true, sparse: true},  // unused
    _facebook_id: {type: String, unique: true, sparse: true}, // unused
    _google_id: {type: String, unique: true, sparse: true},
    local: {
        username: {type: String, unique: true, sparse: true},
        password: String
    },

    // permissions
    isAdmin: {type:Boolean, default: false},

    // user information
    profile: {
        firstName: String,
        lastName: String,
        email: String,
        picture: String,
        new: {type:Boolean, default: true}
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

/**
 * Links an account to this one
 * @param {User} user
 * @param {Function} callback
 */
userSchema.methods.link = function(user, callback) {
    var model = this;

    model.schema.eachPath(function(path) {
        var current = model.get(path),
            news = user.get(path);

        console.log(current, news, path);

        if (current === undefined) {
            model.set(path, news);
        }
    });

    // hack to make sure that password isn't rehashed
    // TODO test to make sure this actually works
    delete this.$__.activePaths.states.modify.password;

    // TODO update references to user in other models

    // we could return here, but eventually
    // we will have to do things that require a callback
    callback(null, model);
};

userSchema.methods.toJSON = function() {
    return {
        id: this._id,
        isAdmin: this.isAdmin,
        twitter: !!this._twitter_id,
        facebook: !!this._facebook_id,
        google: !!this._google_id,
        local: {
            username: this.local && this.local.username ? this.local.username : ""
        },
        profile: {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email,
            picture: this.profile.picture,
            new: this.profile.new
        },
        location: []
    };
}


module.exports = mongoose.model('User', userSchema);
