var mongoose = require('mongoose'),
    Special = require('./Special.js');

var barSchema = new mongoose.Schema({
    name: String,

    start: Number,
    end: Number,

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
barSchema.methods.getSpecials = function(date, callback) {
    if (typeof date === 'function' || date === undefined) {
        callback = date;
        date = new Date();
    }

    return Special.find({
        $and: [
            {_bar_id: this._id},
            {
                $or: [
                    {dates: {
                        $elemMatch: {$and:[
                            {$or: [{year: {$exists: false}}, {year: date.getFullYear()}]},
                            {$or: [{month: {$exists: false}}, {month: date.getMonth()}]},
                            {$or: [{day: {$exists: false}}, {day: date.getDate()}]},
                        ]}
                    }},
                    {days: date.getDay()}
                ]
            }
        ]
    }).exec(callback);
}

/**
 * Overwrite json output
 */
barSchema.methods.toJSON = function() {
    return {
        id: this._id,
        start: this.start,
        end: this.end,
        name: this.name,
        location: this.location
    };
}

module.exports = mongoose.model('Bar', barSchema);
