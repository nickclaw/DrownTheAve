var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {
    
    ['Bar', 'Special', 'User'].forEach(function(type) {
        lType = type.toLowerCase();

        app.post('/admin/api/' + lType, util.admin, function(req, res) {
            db['create'+type](converter[lType](req), function(err, model) {
                res.send(model);
            });
        });

        app.delete('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['delete'+type](req.params.id, function(err, model) {
                res.send(model);
            });
        });

        app.get('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['get' + type](req.params.id, function(err, model) {
                res.send(model);
            });
        });

        app.put('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['update' + type](req.params.id, converter[lType](req), function(err, model) {
                res.send(model);
            });
        });

        app.post('/admin/api/'+lType+'s', util.admin, stripFind, function(req, res) {
            basicSearch(db.Bar, req.body)
                .exec()
                .then(function(bars) {
                    res.send(bars);
                });
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
 * @return {Query}
 */
function basicSearch(Model, options, callback) {
    var sort = {};
    sort[options.sort || '_id'] = options.order || 'asc';

    return Model
        .find(options.find || {})
        .limit(options.limit || 10)
        .skip(options.offset || 0)
        .sort(sort);
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

/**
 * Map of converters to convert Backbone representations into
 * closest mongoose representations. Each function take has
 * @param {Request} req
 * @return {Object}
 */
var converter = {
    bar: function(req) {
        var obj = req.body;

        return obj;
    },
    special: function(req) {
        var obj = req.body;

        return obj;
    },
    user: function(req) {
        var obj = req.body;

        return obj;
    }
}
