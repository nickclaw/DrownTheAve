var mongoose = require('mongoose'),
    Special = require('./Special.js'),
    c = require('../config/constants.js');

// for storing the open hours each day
hoursSchema = new mongoose.Schema({
    start: Number,
    end: Number
});

hoursSchema.methods.toJSON = function() {
    return {
        start: this.start,
        end: this.end
    };
}

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
        "0": {type: [hoursSchema], default: []},
        "1": {type: [hoursSchema], default: []},
        "2": {type: [hoursSchema], default: []},
        "3": {type: [hoursSchema], default: []},
        "4": {type: [hoursSchema], default: []},
        "5": {type: [hoursSchema], default: []},
        "6": {type: [hoursSchema], default: []}
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
        _id: this._id,
        name: this.name,
        website: this.website,
        location: this.location,
        hours: {
            "0": this.hours["0"],
            "1": this.hours["1"],
            "2": this.hours["2"],
            "3": this.hours["3"],
            "4": this.hours["4"],
            "5": this.hours["5"],
            "6": this.hours["6"]
        }
    };
}

barSchema.methods.fromJSON = function(obj) {
    return obj;
}

module.exports = mongoose.model('Bar', barSchema);

module.exports.fromJSON = barSchema.methods.fromJSON;
