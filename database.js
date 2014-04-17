var User = require('./models/User.js'),
    Bar = require('./models/Bar.js');


var toCrud = {
    'User' : User,
    'Bar' : Bar
};

// add get, add, delete functions for each model
for(var key in toCrud) {

    // wrap it in the function so that key doesn't end up being overwritten
    (function(exports, key) {

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
         * Creates a record
         * @param {object} options
         * @param {Function?} callback
         * @return {Promise}
         */
        exports['add' + key] = function(options, callback) {
            return toCrud[key].create(options, callback);
        }

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
