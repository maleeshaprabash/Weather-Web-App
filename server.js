// ========================================
// WEATHER APP - NODE.JS BACKEND SERVER
// ========================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-app';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });

// Import routes
const weatherRoutes = require('./routes/weather');

// API Routes
app.use('/api/weather', weatherRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Weather App API Server',
        version: '1.0.0',
        endpoints: {
            'POST /api/weather': 'Save weather data',
            'GET /api/weather/latest': 'Get latest weather data',
            'GET /api/weather/city/:cityName': 'Get weather by city',
            'GET /api/weather/all': 'Get all weather records',
            'DELETE /api/weather/:id': 'Delete weather record'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📝 API Documentation:`);
    console.log(`   Root: http://localhost:${PORT}/`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Weather API: http://localhost:${PORT}/api/weather`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});
