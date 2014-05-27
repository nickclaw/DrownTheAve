var router = require('express').Router(),
    db = require('../database.js'),
    util = require('./util.js');

router
    .get('/*', util.admin, function(req, res) {
        res.render('admin', {
            user: req.user
        });
    });

module.exports = router;
