var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {

    /******* BARS *******/
    app.post('/admin/api/bar', util.admin, function(req, res) {
        db.createBar(req.body)
            .then(function(bar){
                res.send(bar);
            });
    });

    app.delete('/admin/api/bar/:id', util.admin, function(req, res) {
        db.deleteBar(req.params.id)
            .then(function(bar){
                res.send(bar);
            });
    });

    app.get('/admin/api/bar/:id', util.admin, function(req, res) {
        db.getBar(req.params.id)
            .then(function(bar){
                res.send(bar);
            });
    });

    app.put('/admin/api/bar/:id', util.admin, function(req, res) {
        db.updateBar(req.params.id, req.body)
            .then(function(bar){
                res.send(bar);
            });
    });

    app.post('/admin/api/bars', util.admin, stripFind, function(req, res) {
        basicSearch(db.Bar, req.body)
            .then(function(bars) {
                res.send(bars);
            });
    });



    /******* APPLICATION *******/
    app.get('/admin*', util.admin, function(req, res) {
        res.render('admin', {
            user: req.user
        });
    });
}

/**
 * Basic customizable search
 * @param {Model} model
 * @param {Object?} options
 *                    options.find
 *                    options.limit
 *                    options.offset
 *                    options.sort
 *                    options.order
 * @param {Function?} callback
 * @return {Promise}
 */
function basicSearch(Model, options, callback) {
    var sort = {};
    sort[options.sort || '_id'] = options.order || 'asc';

    return model
        .find(options.find || {})
        .limit(options.limit || 10)
        .skip(options.offset || 0)
        .sort(sort)
        .exec(callback);
}

/**
 * Removes the find parameter from the body
 * so that you can't abuse the database find methods
 * from the browser.
 */
function stripFind(req, res, next) {
    if (req.body.find) {
        delete req.body.find;
    }
    next();
}
