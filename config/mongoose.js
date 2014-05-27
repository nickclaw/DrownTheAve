var em = require('express-mongoose'),        // adds cool functions to express
    timestamps = require('mongoose-timestamp');

module.exports = function(mongoose) {

    mongoose.plugin(timestamps, {
        createdAt: 'created',
        updatedAt: 'updated'
    });
}
