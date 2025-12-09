# Weather App - Backend Setup Guide

## 📋 What's Been Created

Your Node.js backend is now set up with the following files:

- ✅ `server.js` - Main Express server
- ✅ `models/Weather.js` - MongoDB schema for weather data
- ✅ `routes/weather.js` - API endpoints
- ✅ `.env` - Environment configuration
- ✅ `.gitignore` - Git ignore file
- ✅ `package.json` - Dependencies configured

## 🚀 Quick Start

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-app
   ```

**Option B: Local MongoDB**
1. Download MongoDB Community Server
2. Install and start MongoDB service
3. Keep the default `.env` setting:
   ```
   MONGODB_URI=mongodb://localhost:27017/weather-app
   ```

### Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

## 📡 API Endpoints

### Save Weather Data
```http
POST http://localhost:3000/api/weather
Content-Type: application/json

{
  "city": "London",
  "country": "GB",
  "temperature": 15,
  "humidity": 72,
  "windSpeed": 5.2,
  "condition": "Clouds",
  "description": "scattered clouds",
  "forecast": [],
  "coordinates": { "lat": 51.5074, "lon": -0.1278 }
}
```

### Get Latest Weather
```http
GET http://localhost:3000/api/weather/latest
```

### Get Weather by City
```http
GET http://localhost:3000/api/weather/city/London
```

### Get All Weather Records
```http
GET http://localhost:3000/api/weather/all?page=1&limit=10
```

### Delete Weather Record
```http
DELETE http://localhost:3000/api/weather/:id
```

## 🔧 Testing the API

### Using Browser
Visit: `http://localhost:3000/`

### Using Command Line (PowerShell)
```powershell
# Test health check
Invoke-WebRequest -Uri http://localhost:3000/health

# Get latest weather
Invoke-WebRequest -Uri http://localhost:3000/api/weather/latest
```

### Using Postman or Thunder Client
Import the endpoints above and test them

## 🔗 Next Steps: Frontend Integration

You'll need to update your frontend files to send data to the backend:

### Update `script.js`
Add this function after fetching weather from OpenWeatherMap:

```javascript
// Save weather data to backend
async function saveWeatherToBackend(weatherData) {
    try {
        const response = await fetch('http://localhost:3000/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                city: weatherData.name,
                country: weatherData.sys.country,
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                condition: weatherData.weather[0].main,
                description: weatherData.weather[0].description,
                coordinates: {
                    lat: weatherData.coord.lat,
                    lon: weatherData.coord.lon
                }
            })
        });
        
        const result = await response.json();
        console.log('✅ Weather saved to backend:', result);
    } catch (error) {
        console.error('❌ Error saving to backend:', error);
    }
}
```

### Update `chart.js`
Fetch data from backend instead of localStorage:

```javascript
// Fetch weather data from backend
async function fetchWeatherFromBackend() {
    try {
        const response = await fetch('http://localhost:3000/api/weather/latest');
        const result = await response.json();
        
        if (result.success) {
            updateChartsWithData(result.data);
        }
    } catch (error) {
        console.error('❌ Error fetching from backend:', error);
    }
}
```

## 🛠️ Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access (for Atlas)

### Port Already in Use
Change port in `.env`:
```
PORT=3001
```

### CORS Errors
The server is configured with CORS enabled. If you still get errors, check that you're making requests from the correct origin.

## 📚 Available Scripts

- `npm start` - Run server (production)
- `npm run dev` - Run server with nodemon (development)

## 🎯 What's Next?

1. ✅ Backend is ready
2. 🔄 Integrate frontend (update script.js and chart.js)
3. 🧪 Test the full flow
4. 🚀 Deploy (optional)

Need help? Check the console logs for detailed error messages!
