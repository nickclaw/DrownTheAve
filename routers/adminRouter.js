var db = require('../database.js'),
    c = require('../config/constants.js');

module.exports = function(app, passport) {

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
            if (err) console.log(err);

            res.redirect('/admin/bars');
        });
    });

    /**
     * Renders the edit bar page
     */
    app.get('/admin/bar/edit/:id', function(req, res) {
        res.render('admin/bar', {
            bar: db.Bar.findById(req.params.id).exec()
        });
    });

    /**
     * Updates a bar
     */
    app.post('/admin/bar/edit/:id', function(req, res) {
        var hours = req.body.hours.map(function(ranges) {
            var ends = ranges.end;
            return ranges.start.map(function(start, index) {
                return {start: start, end: ends[index]};
            });
        });

        res.render('admin/bar', {
            bar: db.Bar.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                website: req.body.website,
                location: [req.body.long, req.body.lat],
                hours: hours
            })
        });
    });

    /**
     * Renders the page to add a bar
     */
    app.get('/admin/bar/add', function(req, res) {
        res.render('admin/bar', {
            bar: new db.Bar()
        });
    });

    /**
     * Creates a new bar
     */
    app.post('/admin/bar/add', function(req, res) {
        var hours = req.body.hours.map(function(ranges) {
            var ends = ranges.end;
            return ranges.start.map(function(start, index) {
                return {start: start, end: ends[index]};
            });
        });

        db.Bar.create({
            name: req.body.name,
            website: req.body.website,
            location: [req.body.long, req.body.lat],
            hours: hours
        }, function(err, bar) {
            res.redirect('/admin/bars');
        });
    });
}
