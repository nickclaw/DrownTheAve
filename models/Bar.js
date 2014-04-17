var mongoose = require('mongoose');

var barSchema = new mongoose.Schema({
    name: String,
    location: {
        lat: Number,
        long: Number
    }
});

module.exports = mongoose.model('Bar', barSchema);
