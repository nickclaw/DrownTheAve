var User = module.exports.User = require('./models/User.js');
var Bar = module.exports.Bar = require('./models/Bar.js');

/******** CRUD ********/
var toCrud = {
    'User' : User,
    'Bar' : Bar
};
for(var key in toCrud) {

    // wrap it in a closure so that key doesn't end up being overwritten
    (function(exports, key) {

        /**
         * Creates a record
         * @param {object} options
         * @param {Function?} callback
         * @return {Promise}
         */
        exports['create' + key] = function(options, callback) {
            return toCrud[key].create(options, callback);
        }

        /**
         * Retrieves or searches for the record
         * @param {object|Number} options|id
         * @param {Function?} callback
         * @return {Promise}
         */
        exports['get' + key] = function(options, callback) {
            if (typeof options === 'string') {
                options = {_id: options};
            }

            return toCrud[key].find(options).exec(callback);
        };

        /**
         * Deletes a record
         * @param {object|Number} options|id
         * @param {Function?} callback
         * @return {Promise}
         */
        exports['delete' + key] = function(options, callback) {
            if (typeof options === 'string') {
                options = {_id: options};
            }

            return toCrud[key].remove(options).exec(callback);
        }

    })(exports, key);
}
