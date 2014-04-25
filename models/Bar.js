var mongoose = require('mongoose'),
    Special = require('./Special.js');

var barSchema = new mongoose.Schema({
    name: String,
    location: {
        type: [Number],
        index: '2dsphere',
        required: true
    }
});

/**
 * Gets all the specials for the day
 * @param {Date?} day
 * @param {Function} callback
 * @return {Promise}
 */
barSchema.methods.getSpecials = function(now, callback) {
    if (typeof now === 'function') {
        callback = now;
        now = new Date();
    }

    now.setHours(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(0);

    return Special.find({
        $and: [
            {_bar_id: this._id},
            {$or: [
                {days: now.getDay()},
                {dates: now.floor(Day.Date).toUTC()}
            ]}
        ]
    }).exec(callback);
}

module.exports = mongoose.model('Bar', barSchema);
