var mongoose = require('mongoose'),
    DateRange = require('./DateRange.js');

var specialSchema = new mongoose.Schema({
    _bar_id: {type: mongoose.Schema.Types.ObjectId, ref: "Bar"},
    
    dates: {type: [DateRange], default: []},
    deal: String
});

/**
 * Overwrite json output
 */
specialSchema.methods.toJSON = function() {
    var obj = {
        id: this._id,
        bar: this._bar_id,
        barName: null, // filled in later if applicable
        deal: this.deal,
        dates: this.dates
    };

    // if model has been populated...
    if (typeof obj.bar === 'object') {
        obj.barName = obj.bar.name;
        obj.bar = obj.bar.id;
    }

    return obj;
}

module.exports = mongoose.model('Special', specialSchema);
