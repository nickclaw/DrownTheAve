var db = require('../database.js');

module.exports = function(app, passport) {

    app.get('/admin/bars', function(req, res) {
        res.render('admin/bars', {
            bars: db.Bar.find().exec()
        });
    });

    app.get('/admin/bar/delete/:id', function(req, res) {
        db.Bar.findByIdAndRemove(req.params.id, function(err) {
            if (err) console.log(err);

            res.redirect('/admin/bars');
        });
    });
}
