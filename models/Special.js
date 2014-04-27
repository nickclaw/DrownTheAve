var mongoose = require('mongoose');

var specialSchema = new mongoose.Schema({
    _bar_id: {type: mongoose.Schema.Types.ObjectId, ref: "Bar"},

    // time frame
    start: Number,
    end: Number,

    days: {type: [Number], default: []}, // if weekly
    dates: {type: [{
        year: Number,
        month: Number,
        day: Number
    }], default: []}, // if other or date

    deal: String
});

/**
 * Overwrite json output
 */
specialSchema.methods.toJSON = function() {
    return {
        id: this._id,
        start: this.start,
        end: this.end,
        deal: this.deal
    };
}

module.exports = mongoose.model('Special', specialSchema);
