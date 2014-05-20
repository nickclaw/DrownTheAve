var router = require('express').Router(),
    db = require('../database.js'),
    util = require('./util.js');

// search
router
    .param('type', function(req, res, next, type) {
        type = type.toProperCase();
        if (db[type]) {
            req.type = db[type];
            next();
        } else {
            next('Invalid type.');
        }
    })
    .post('/crud/:type/search', stripFind, function(req, res, next) {
        basicSearch(req.type, req.body)
            .populate('bar') // only does anything on specials
            .exec(function(err, models) {
                if (err) return next(err);
                res.send(models);
            });
    })
    .route('/crud/:type')

        // retrieve
        .get(function(req, res, next) {
            db['get'+req.type.modelName](req.query.id, function(err, model) {
                if (err) return next(err);
                if (!model) return next('no model');
                res.send(model);
            });
        })

        // create
        .post(function(req, res, next) {
            db['create'+req.type.modelName](req.type.fromJSON(req.body), function(err, model) {
                if (err) return next(err);
                res.send(model);
            });
        })

        // update
        .put(function(req, res, next) {
            db['update'+req.type.modelName](req.body.id, req.type.fromJSON(req.body), function(err, model) {
                if (err) return next(err);
                res.send(model);
            });
        })

        // delete
        .delete(function(req, res, next) {
            db['delete'+req.type.modelName](req.body.id, function(err, model) {
                if (model) return res.send(model);
                next(err);
            });
        })
    ;

module.exports = router;

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
    sort[options.sort || 'id'] = options.order || 'asc';

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
