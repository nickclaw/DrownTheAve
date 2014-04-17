var User = require('./models/User.js'),
    Bar = require('./models/Bar.js');


var toCrud = {
    'User' : User,
    'Bar' : Bar
};

// add get, add, delete functions for each model
for(key in toCrud) {

    /**
     * Retrieves or searches for the record
     * @param {object|Number} options|id
     * @param {Function?} callback
     * @return {Promise}
     */
    exports['get' + key] = function(options, callback) {
        if (typeof options === 'number') {
            options = {id: options};
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
        if (typeof options === 'number') {
            options = {id: options};
        }

        return toCrud[key].remove(options).exec(callback);
    }
}
