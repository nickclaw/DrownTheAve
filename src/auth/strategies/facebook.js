var FacebookStrategy = require('passport-facebook').Strategy
    db = require('../../database/Database'),
    User = db.User;

module.exports = new FacebookStrategy({
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
});
