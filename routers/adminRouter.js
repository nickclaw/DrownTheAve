var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {

    app.get('/admin', util.admin, function(req, res) {
        res.render('admin', {
            user: req.user.toJSON()
        });
    });


    // create REST functions for all models
    ['Bar', 'Special'].forEach(function(model) {

        /**
         * Returns a collections of objects
         */
        app.get('/admin/' + model.toLowerCase() + 's', util.admin, function(req, res) {
            var limit = req.query.limit || 20,
                offset = req.query.offset || 0,
                sort = {};

            sort[req.query.sort || '_id'] = req.query.order || 'asc';

            db[model]
                .find({})
                .limit(limit)
                .skip(offset)
                .sort(sort)
                .exec()
                .then(function(bars) {
                    res.send(bars);
                });
        });

    });
}
