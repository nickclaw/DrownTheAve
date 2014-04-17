var mongoose = require('mongoose');

var barSchema = new mongoose.Schema({
    name: String,
    location: {
        type: [Number],
        index: '2dsphere',
        required: true
    }
});

module.exports = mongoose.model('Bar', barSchema);
