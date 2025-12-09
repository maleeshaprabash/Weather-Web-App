const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');

// @route   POST /api/weather
// @desc    Save weather data
// @access  Public
router.post('/', async (req, res) => {
    try {
        const weatherData = new Weather({
            city: req.body.city,
            country: req.body.country,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            windSpeed: req.body.windSpeed,
            condition: req.body.condition,
            description: req.body.description,
            forecast: req.body.forecast || [],
            coordinates: req.body.coordinates
        });

        const savedWeather = await weatherData.save();
        res.status(201).json({
            success: true,
            message: 'Weather data saved successfully',
            data: savedWeather
        });
    } catch (error) {
        console.error('Error saving weather data:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving weather data',
            error: error.message
        });
    }
});

// @route   GET /api/weather/latest
// @desc    Get the most recent weather data
// @access  Public
router.get('/latest', async (req, res) => {
    try {
        const latestWeather = await Weather.findOne()
            .sort({ createdAt: -1 })
            .limit(1);

        if (!latestWeather) {
            return res.status(404).json({
                success: false,
                message: 'No weather data found'
            });
        }

        res.json({
            success: true,
            data: latestWeather
        });
    } catch (error) {
        console.error('Error fetching latest weather:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// @route   GET /api/weather/city/:cityName
// @desc    Get weather data for a specific city
// @access  Public
router.get('/city/:cityName', async (req, res) => {
    try {
        const cityWeather = await Weather.findOne({
            city: new RegExp(req.params.cityName, 'i')
        }).sort({ createdAt: -1 });

        if (!cityWeather) {
            return res.status(404).json({
                success: false,
                message: `No weather data found for ${req.params.cityName}`
            });
        }

        res.json({
            success: true,
            data: cityWeather
        });
    } catch (error) {
        console.error('Error fetching city weather:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// @route   GET /api/weather/all
// @desc    Get all weather records (with pagination)
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const weatherData = await Weather.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Weather.countDocuments();

        res.json({
            success: true,
            data: weatherData,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching all weather data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// @route   DELETE /api/weather/:id
// @desc    Delete weather record by ID
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedWeather = await Weather.findByIdAndDelete(req.params.id);

        if (!deletedWeather) {
            return res.status(404).json({
                success: false,
                message: 'Weather record not found'
            });
        }

        res.json({
            success: true,
            message: 'Weather record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting weather data:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting weather data',
            error: error.message
        });
    }
});

module.exports = router;
