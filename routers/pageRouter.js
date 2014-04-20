var db = require('../database.js');

module.exports = function(app, passport) {

    /**
     * Homepage
     */
    app.get('', function(req, res) {

        res.render('home', {
            user: req.user,
            bars: db.getBars(req)
        });
    });
}
