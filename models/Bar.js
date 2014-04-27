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
