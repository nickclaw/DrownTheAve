var LocalStrategy  = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    User = require('../models/User.js');

module.exports = function(passport) {


    // serialize and unserialize by id
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, done);
    });

    /******** LOCAL ********/
    // for signin up
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

    // for logging in
    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    }, function(req, username, password, done) { // callback with email and password from our form

        User.findOne({ 'local.username' :  username }, function(err, user) {
            // check for error
            if (err) return done(null, false);

            // check to see if user exists
            if (!user) return done(null, false);

            // check to see if password is correct
            if (!user.checkPassword(password)) return done(null, false);

            done(null, user);
        });
    }));

    /******** GOOGLE ********/
    passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:8080/auth/google/return',
        realm: 'http://localhost:8080'
    }, function(id, profile, done) {

        // TODO extract id from 'id' url?

        User.findOne({ '_google_id' : id }, function(err, user) {

            // if user doesn't exist, create one
            if (!user) {
                (new User({
                    _google_id: id,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails ? profile.emails[0].value : undefined
                    }
                })).save(function(err, user, numChanged) {
                    if (err) return done(null, false);
                    done(null, user);
                });

            // otherwise return user
            } else {
                done(null, user);
            }
        });
    }));

}
