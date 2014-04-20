var LocalStrategy  = require('passport-local').Strategy;
    User = require('../models/User.js');

module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, done);
    });

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
    }, function(req, username, password, done) {

        (new User({
            local: {
                username: username,
                password: password
            }
        })).save(function(err, user, numChanged) {
            if (err) return done(null, false);

            done(null, user);
        });
    }));


    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },function(req, username, password, done) { // callback with email and password from our form

        User.findOne({ 'local.username' :  username }, function(err, user) {
            // check for error
            if (err) return done(null, false);

            // check to see if user exists
            console.log('checking for user');
            if (!user) return done(null, false);

            // check to see if password is correct
            console.log('checking password');
            if (!user.checkPassword(password)) return done(null, false);

            done(null, user);
        });
    }));

}
