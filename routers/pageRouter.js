var database = require('../database.js');

module.exports = function(app) {
    app.get('', function(req, res) {
        res.render('home', {

        });
    });
}
