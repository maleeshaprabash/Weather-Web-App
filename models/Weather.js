const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    forecast: {
        type: Array,
        default: []
    },
    coordinates: {
        lat: Number,
        lon: Number
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
weatherSchema.index({ city: 1, createdAt: -1 });

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
