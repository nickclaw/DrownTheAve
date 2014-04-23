var mongoose = require('mongoose');

var specialSchema = new mongoose.Schema({
    _bar_id: {type: mongoose.Schema.Types.ObjectId, ref: "Bar"},

    // time frame
    start: Number,
    end: Number,

    days: [Number], // if recurring
    dates: [Date], // if temporary

    deal: String
});

module.exports = mongoose.model('Special', specialSchema);
