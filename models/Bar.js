var mongoose = require('mongoose'),
    Special = require('./Special.js');

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
        required: true
    },

    hours: {
        0: [hoursSchema],
        1: [hoursSchema],
        2: [hoursSchema],
        3: [hoursSchema],
        4: [hoursSchema],
        5: [hoursSchema],
        6: [hoursSchema]
    }
});

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
