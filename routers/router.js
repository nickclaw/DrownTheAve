var router = require('express').Router(),
    adminRouter = require('./adminRouter.js'),
    crudRouter = require('./crudRouter.js'),
    apiRouter = require('./apiRouter.js'),
    authRouter = require('./authRouter.js'),
    publicRouter = require('./publicRouter.js');

router
    .use('/admin', adminRouter)
    .use('/api', crudRouter, apiRouter)
    .use('/auth', authRouter)
    .use('/', publicRouter)
;


module.exports = router;
