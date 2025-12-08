// ========================================
// WEATHER MAP - JAVASCRIPT
// ========================================

// API Configuration
const API_KEY = 'e6b1f89d3930f16a4461a429f7433c7e'; // Your OpenWeatherMap API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

// Global variables
let map;
let currentMarker;

// DOM Elements
const mapElement = document.getElementById('map');
const loadingElement = document.getElementById('loading');
const locationInfo = document.getElementById('location-info');
const closeInfoBtn = document.getElementById('close-info');
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    getUserLocation();
    setupEventListeners();
});

// Initialize Leaflet map
function initializeMap() {
    // Create map centered on default location
    map = L.map('map').setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    // Add click event to map
    map.on('click', onMapClick);

    console.log('✅ Map initialized');
}

// Get user's location using IP Geolocation
async function getUserLocation() {
    try {
        showLoading(true);
        console.log('🌍 Fetching user location via IP...');

        const response = await fetch(IP_GEOLOCATION_URL);
        if (!response.ok) throw new Error('Failed to fetch location');

        const data = await response.json();
        console.log('✅ Location detected:', data);

        const lat = data.latitude;
        const lon = data.longitude;
        const city = data.city;
        const country = data.country_name;

        // Center map on user location
        map.setView([lat, lon], 10);

        // Add marker and fetch weather
        addLocationMarker(lat, lon, `${city}, ${country}`, true);
        fetchWeatherData(lat, lon);

        showLoading(false);
    } catch (error) {
        console.error('❌ Error getting user location:', error);
        showLoading(false);
        // Fallback to default location
        map.setView([51.505, -0.09], 5);
    }
}

// Search for a location by city name
async function searchLocation(cityName) {
    if (!cityName.trim()) {
        alert('Please enter a city name');
        return;
    }

    try {
        showLoading(true);
        console.log('🔍 Searching for:', cityName);

        // Use OpenWeatherMap Geocoding API
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        const response = await fetch(geoUrl);

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        if (data.length === 0) {
            throw new Error('City not found');
        }

        const location = data[0];
        const lat = location.lat;
        const lon = location.lon;
        const name = `${location.name}, ${location.country}`;

        // Center map on searched location
        map.setView([lat, lon], 10);

        // Add marker and fetch weather
        addLocationMarker(lat, lon, name, true);
        fetchWeatherData(lat, lon);

        showLoading(false);
    } catch (error) {
        console.error('❌ Error searching location:', error);
        alert('City not found. Please try again.');
        showLoading(false);
    }
}

// Handle map click events
function onMapClick(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    console.log('📍 Map clicked:', lat, lon);

    // Add marker at clicked location
    addLocationMarker(lat, lon, 'Selected Location', true);

    // Fetch weather for clicked location
    fetchWeatherData(lat, lon);
}

// Add marker to map
function addLocationMarker(lat, lon, name, isMain = false) {
    // Remove previous main marker if exists
    if (isMain && currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Create custom icon
    const icon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Create marker
    const marker = L.marker([lat, lon], { icon: icon }).addTo(map);
    marker.bindPopup(`<b>${name}</b><br>Loading weather...`).openPopup();

    if (isMain) {
        currentMarker = marker;
    }

    return marker;
}

// Fetch weather data for location
async function fetchWeatherData(lat, lon) {
    try {
        console.log('🌤️ Fetching weather for:', lat, lon);

        const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Failed to fetch weather');

        const data = await response.json();
        console.log('✅ Weather data:', data);

        // Update location info panel
        updateLocationInfo(data);

        // Update marker popup
        if (currentMarker) {
            const popupContent = `
                <div style="color: #333;">
                    <b style="color: #333; font-size: 14px;">${data.name}, ${data.sys.country}</b><br>
                    <span style="color: #333;">🌡️ ${Math.round(data.main.temp)}°C</span><br>
                    <span style="color: #333;">${data.weather[0].description}</span>
                </div>
            `;
            currentMarker.setPopupContent(popupContent);
        }
    } catch (error) {
        console.error('❌ Error fetching weather:', error);
        alert('Unable to fetch weather data. Please try again.');
    }
}

// Update location info panel
function updateLocationInfo(data) {
    document.getElementById('location-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('map-temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('map-condition').textContent = data.weather[0].description;
    document.getElementById('map-humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('map-wind').textContent = `${Math.round(data.wind.speed)} m/s`;

    // Show info panel
    locationInfo.classList.remove('hidden');
}

// Setup event listeners
function setupEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        searchLocation(city);
    });

    // Enter key in search input
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value;
            searchLocation(city);
        }
    });

    // Close info panel
    closeInfoBtn.addEventListener('click', () => {
        locationInfo.classList.add('hidden');
    });
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

console.log('🗺️ Map script loaded');
