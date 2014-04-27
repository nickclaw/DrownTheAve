var LocalStrategy  = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../models/User.js'),
    db = require('../database.js'),
    url = require('url');

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
            },
            profile: {
                new: true
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

        var isLink = false,
            currentUser = req.user;

        User.findOne({ 'local.username' :  username }, function(err, user) {
            // check for error
            if (err) return done(null, false);

            // check to see if user exists
            if (!user) return done(null, false);

            // check to see if password is correct
            if (!user.checkPassword(password)) return done(null, false);

            isLink ? db.linkAccounts(currentUser, user, done) : done(null, user);
        });
    }));


    /******** GOOGLE ********/
    passport.use('google', new GoogleStrategy({
        returnURL: 'http://localhost:8080/auth/google/return',
        realm: 'http://localhost:8080',
        passReqToCallback: true
    }, function(req, idUrl, profile, done) {
        var id = url.parse(idUrl, true).query.id,  // go from url to id
            isLink = false;                        // is the user linking
            currentUser = null;                    // currently signed in user

        if (req.user) {
            isLink = true;
            currentUser = req.user;
        }

        User.findOne({ '_google_id' : id }, function(err, user) {

            // if user doesn't exist, create one
            if (!user) {
                (new User({
                    _google_id: id,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails ? profile.emails[0].value : undefined,
                        new: true
                    }
                })).save(function(err, user, numChanged) {
                    if (err) return done(null, false);

                    isLink ? db.linkAccounts(currentUser, user, done) : done(null, user);
                });

            // otherwise return user
            } else {
                isLink ? db.linkAccounts(currentUser, user, done): done(null, user);
            }
        });
    }));


    /******** FACEBOOK ********/
    passport.use('facebook', new FacebookStrategy({
        clientID: "ID_GOES_HERE",
        clientSecret: "SECRET_GOES_HERE",
        callbackURL: "http://localhost:8080/auth/facebook/return",
        enableProof: false,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        var id = '1',
            isLink = false,
            currentUser = null;

        if (req.user) {
            isLink = true;
            currentUser = req.user;
        }

        User.findOne({ '_facebook_id': id}, function(err, user) {

            if (!user) {
                (new User({
                    _facebook_id: id,
                    profile: {
                        firstName: 'first_name',
                        lastName: 'last_name',
                        email: 'email@email.com',
                        new: true
                    }
                })).save(function(err, user, numChanged) {
                    if (err) return done(null, false);

                    isLink ? db.linkAccounts(currentUser, user, done) : done(null, user);
                });
            } else {
                isLink ? db.linkAccounts(currentUser, user, done): done(null, user);
            }

        });
    }));
}
