var GoogleStrategy = require('passport-google').Strategy,
    db = require('../../database/Database'),
    User = db.User,
    url = require('url');

module.exports = new GoogleStrategy({
    returnUrl: 'http://localhost:8080/auth/google/return',
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
});
