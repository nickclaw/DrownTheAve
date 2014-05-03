var db = require('../database.js'),
    c = require('../config/constants.js');

module.exports = function(app, passport) {

    /*********** BARS ************/

    /**
     * Shows all current bars
     */
    app.get('/admin/bars', function(req, res) {
        res.render('admin/bars', {
            bars: db.Bar.find().exec()
        });
    });

    /**
     * Deletes a bar and redirects
     */
    app.get('/admin/bar/delete/:id', function(req, res) {
        db.Bar.findByIdAndRemove(req.params.id, function(err) {
            res.redirect('/admin/bars');
        });
    });

    /**
     * Edits a bar
     */
    app.get('/admin/bar/edit/:id', function(req, res) {
        res.render('admin/bar', {
            bar: db.Bar.findById(req.params.id).exec(),
            specials: db.Special.find({_bar_id: req.params.id}).exec()
        });
    });
    app.post('/admin/bar/edit/:id', function(req, res) {
        var barData = buildBarFromReq(req);
        db.Bar.findByIdAndUpdate(req.params.id, barData, function(err, bar) {
            res.redirect('/admin/bar/edit/' + bar.id);
        });
    });

    /**
     * Creates a new bar
     */
    app.get('/admin/bar/add', function(req, res) {
        res.render('admin/bar', {
            bar: new db.Bar(),
            specials: []
        });
    });
    app.post('/admin/bar/add', function(req, res) {
        var barData = buildBarFromReq(red);
        db.Bar.create(barData, function(err, bar) {
            res.redirect('/admin/bar/' + bar.id);
        });
    });



    /********** SPECIALS ************/

    /**
     * Shows all specials
     */
    app.get('/admin/specials', function(req, res) {
        res.render('admin/specials', {
            specials: db.Special.find()
                                .sort({_bar_id: 'asc'})
                                .populate('_bar_id')
                                .exec()
        });
    });

    /**
     * Deletes a special
     */
    app.get('/admin/special/delete/:id', function(req, res) {
        db.Special.findByIdAndRemove(req.params.id, function(err) {
            res.redirect('/admin/specials');
        });
    });

    /*
     * Edit a special
     */
    app.get('/admin/special/edit/:id', function(req, res) {
        res.render('admin/special', {
            special: db.Special.findById(req.params.id).populate('_bar_id').exec(),
            bars: db.Bar.find().exec()
        });
    });
    app.post('/admin/special/edit/:id', function(req, res) {
        var specialData = buildSpecialByReq(req);
        db.Special.findByIdAndUpdate(req.param.id, specialData, function(err, special) {
            res.redirect('/admin/special/'+special.id);
        });
    });

    /**
     * Create a special
     */
    app.get('/admin/special/add', function(req, res) {
        res.render('admin/special', {
            special: {_bar_id:{}, dates:[]}, //proxy
            bars: db.Bar.find().exec()
        });
    });
    app.post('/admin/special/add', function(req, res) {
        var specialData = buildSpecialFromReq(req);

        db.Special.create(specialData, function(err, special) {
            res.redirect('/admin/special/edit/'+special.id);
        });
    });


    /*********** HELPER FUNCTIONS ***********/

    /**
     * Parses body data to an object barSchema can use
     * @param {Request} req
     * @return {Object}
     */
    function buildBarFromReq(req) {
        var obj = {},
            input = req.body.hours || [],
            hours = input.map(function(ranges) {
                var ends = ranges.end;
                return ranges.start.map(function(start, index) {
                    return {start: start, end: ends[index]};
                });
            });

        obj.hours = hours;
        obj.name = req.body.name || "";
        obj.website = req.body.website || "";
        obj.location = [req.body.long, req.body.lat];

        return obj;
    }

    /**
     * Parses body data to an object specialSchema can use
     * @param {Request} req
     * @return {Object}
     */
    function buildSpecialFromReq(req) {
        var obj = {},
            input = req.body.dates || {},
            years = input.year || [],
            months = input.month || [],
            dates = input.date || [],
            days = input.day || [];
            dates = years.map(function(value, index) {
                return {
                    year: value || undefined,
                    month: months[index] || undefined,
                    date: dates[index] || undefined,
                    day: days[index] || undefined
                };
            });

        obj.dates = dates;
        obj.start = req.body.start;
        obj.end = req.body.end;
        obj.deal = req.body.deal;
        obj._bar_id = req.body._bar_id;

        return obj;
    }
}
