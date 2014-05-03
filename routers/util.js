module.exports = {

    /**
     * Redirect when unathorized
     */
    auth: function(req, res, next) {
        if(req.user) return next();
        res.redirect('/');
    },

    /**
     * Redirect when authorized
     */
    unauth: function(req, res, next) {
        if(!req.user) return next();
        res.redirect('/');
    },

    /**
     * Redirect if not an admin
     */
    admin: function(req, res, next) {
        if (req.user && req.user.isAdmin) return next();
        res.redirect('/');
    },

    /**
     * Return error when unauthorized
     */
    authJSON: function(req, res, next) {
        if(req.user) return next();
        res.send({
            error: "Not signed in."
        });
    },

    /**
     * Return error when authorized
     */
    unauthJSON: function(req, res, next) {
        if(!req.user) return next();
        res.send({
            error: "Signed in."
        });
    },

    /**
     * Returns error when not an admin
     */
    adminJSON: function(req, res, next) {
        if (req.user && req.user.isAdmin) return next();
        res.send({
            error: "Not an admin."
        });
    }
}
