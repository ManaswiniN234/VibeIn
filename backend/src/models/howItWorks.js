const mongoose = require("mongoose");

const HowItWorksSchema = mongoose.Schema({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HowItWorks = mongoose.model("HowItWorks", HowItWorksSchema);

module.exports = HowItWorks;