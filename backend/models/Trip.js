const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itinerary: [
        {
            day: Number,
            activities: [String]
        }
    ]
    ,createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', TripSchema);