var mongoose = require('mongoose'),
    Special = require('./Special.js'),
    c = require('../config/constants.js');

// for storing the open hours each day
hoursSchema = new mongoose.Schema({
    start: Number,
    end: Number
});

var barSchema = new mongoose.Schema({
    name: String,
    website: String,

    location: {
        type: [Number],
        index: '2dsphere',
        required: true,
        default: c.THE_AVE
    },

    hours: {
        0: {type: [hoursSchema], default: []},
        1: {type: [hoursSchema], default: []},
        2: {type: [hoursSchema], default: []},
        3: {type: [hoursSchema], default: []},
        4: {type: [hoursSchema], default: []},
        5: {type: [hoursSchema], default: []},
        6: {type: [hoursSchema], default: []}
    }
});

/**
 * Returns true if the bar is open
 * @param {Date?} date defaults to now
 * @return {Boolean}
 */
barSchema.methods.isOpen = function(date) {
    if (date === undefined) date = new Date();
    var ranges = this.hours[date.getDay()],
        milli = Math.floor(date.valueOf() % 1000);
    for (var i = 0; i < ranges.length; i++) {
        if (ranges[i].start ) {
            
        }
    }
    return false;
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
