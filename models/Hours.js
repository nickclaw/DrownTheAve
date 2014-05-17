var mongoose = require('mongoose');

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

hoursSchema.methods.fromJSON = function(obj) {
    return obj;
}

module.exports = mongoose.model('Hours', hoursSchema);

module.exports.fromJSON = hoursSchema.methods.fromJSON;
