const mongoose = require('mongoose');

//first we create the schema
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    target: {
        type: String
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
    customers: [String],
});

// finally we need to create a model with the schema en export it
// connects the launchesSchema with the "launches" collection
// first param needs to be capitalized and singular. Mongoose does the change itself later
module.exports = mongoose.model('Launch', launchesSchema);