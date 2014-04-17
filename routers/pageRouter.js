var database = require('../database.js');

module.exports = function(app) {

    /**
     * Homepage
     */
    app.get('', function(req, res) {
        res.render('home', {
            users: database.getUser("534f7a5f24ffcf95def997d8")
        });
    });
}
