var db = require('../database.js'),
    util = require('./util.js');

module.exports = function(app, passport) {

    ['Bar', 'Special', 'User'].forEach(function(type) {
        lType = type.toLowerCase();

        /**
         * Paginated search for models
         * Will eventually be a custom function for each model
         */
        app.post('/admin/api/'+lType+'/search', util.admin, stripFind, function(req, res) {
            basicSearch(db[type], req.body)
                .populate('_bar_id') // only does anything on specials
                .exec()
                .then(function(bars) {
                    res.send(bars);
                });
        });

        /**
         * Creates a new model
         */
        app.post('/admin/api/' + lType, util.admin, function(req, res) {
            db['create'+type](converter[lType](req), function(err, model) {
                if (model) return res.send(model);
                res.send(404, {error:err});
            });
        });

        /**
         * Deletes a model and returns it (i think)
         */
        app.delete('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['delete'+type](req.params.id, function(err, model) {
                if(model) return res.send(model);
                res.send(404, {error: err});
            });
        });

        /**
         * Retrieves a model
         */
        app.get('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['get' + type](req.params.id, function(err, model) {
                if (model) return res.send(model);
                res.send(404, {error: err})
            });
        });

        /**
         * Updates a model
         */
        app.put('/admin/api/'+lType+'/:id', util.admin, function(req, res) {
            db['update' + type](req.params.id, converter[lType](req), function(err, model) {
                if (model) return res.send(model);
                res.send(404, {error: err});
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
