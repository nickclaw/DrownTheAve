var User = require('./models/User.js'),
    Bar = require('./models/Bar.js');

module.exports = {

    /**
     * Retrieves all bars within a certain distance
     * @param {Array} lat/long defaults to the ave
     * @param {Number} distance defaults to 1 mile
     * @param {Function} callback
     * @return {Promise}
     */
    getBars: function(location, distance, callback) {
        return Bar.find({
            location: {
                $geoWithin: {
                    $center: [location, distance]
                }
            }
        }).exec(callback);
    }
}
