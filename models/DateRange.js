var mongoose = require('mongoose');

var dateRangeSchema = new mongoose.Schema({
    year: {type: Number},
    month: {type: Number, min: 0, max: 11}, // months are zero indexed
    date: {type: Number, min: 1, max: 31},
    day: {type: Number, min: 0, max: 6}, // days are zero indexed
    start: {type: Number, min: 0, max: 86400000}, // milliseconds
    end: {type: Number, min: 0, max: 86400000} // milliseconds
});

/**
 * Overwrite JSOn output
 * Don't care about id because this will always be nested
 */
dateRangeSchema.methods.toJSON = function() {
    return {
        year: this.year,
        month: this.month,
        date: this.date,
        day: this.day,
        start: this.start,
        end: this.end
    };
}

module.exports = mongoose.model('DateRange', dateRangeSchema);
