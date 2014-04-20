
module.exports = function(app, passport) {

    /**
     * Homepage
     */
    app.get('', function(req, res) {
        res.render('home', {
            user: req.user
        });
    });
}
