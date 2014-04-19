var LocalStrategy  = require('passport-local').Strategy;
    User = require('../models/User.js');

module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        User.findOne({'username' : username}, done);
    });

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
    }, function(req, username, password, done) {

        (new User({
            username: username
        })).save(function(err, user, numChanged) {
            if (err) return done(null, false);

            done(null, user);
        });
    }));


    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },function(req, username, password, done) { // callback with email and password from our form

        User.findOne({ 'username' :  username }, function(err, user) {
            if (err) return done(null, false);

            done(null, user);
        });
    }));

}
