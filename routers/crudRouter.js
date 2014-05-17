var router = require('express').Router(),
    db = require('../database.js'),
    util = require('./util.js');

router
    .param('type', function(req, res, next, type) {
        type = type.toProperCase();
        if (db[type]) {
            req.type = db[type];
            req.type.name = type;
        } else {
            next('Invalid type.');
        }
    })
    .route('/crud/:type')

        // retrieve
        .get(function(req, res, next) {
            db['get'+req.type.name](req.body._id, function(err, model) {
                if (model) return res.send(model);
                next(err);
            });
        })

        // create
        .post(function(req, res, next) {
            db['create'+req.type.name](req.type.fromJSON(req.body), function(err, model) {
                if (model) return res.send(model);
                next(err);
            });
        })

        // update
        .put(function(req, res, next) {
            db['update'+req.type.name](req.body._id, req.type.fromJSON(req.body), function(err, model) {
                if (model) return res.send(model);
                next(err);
            });
        })

        // delete
        .delete(function(req, res, next) {
            db['delete'+req.type.name](req.body._id, function(err, model) {
                if (model) return res.send(model);
                next(err);
            });
        })
    ;

// search
router.post('/crud/:type/search', stripFind, function(req, res, next) {
    basicSearch(db[type], req.body)
        .populate('_bar_id') // only does anything on specials
        .exec()
        .then(function(bars) {
            res.send(bars);
        })
        .error(function(err) {
            next(err);
        });
})

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
