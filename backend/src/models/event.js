const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: String,
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
