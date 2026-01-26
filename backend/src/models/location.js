const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
