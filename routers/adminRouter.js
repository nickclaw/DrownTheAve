var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {

    app.get('/admin', util.admin, function(req, res) {
        res.render('admin', {
            user: req.user.toJSON()
        });
    });
}
