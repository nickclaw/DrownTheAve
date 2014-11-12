var database = require('./src/database/Database')
    app = require('./src/app/App'),
    Promise = require('bluebird');

require('./config/env');

Promise.all([
    database.start({url: 'mongodb://127.0.0.1/drowntheave'}),
    app.start({port: 8080})
]).then(function() {
    console.log('√ running')
}).catch(function(err) {
    console.log('X', err.message, err.stack);
});
