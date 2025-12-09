// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchWeatherFromBackend();
});

let temperatureChart, weatherDistChart, humidityWindChart;

// Fetch weather data from backend
async function fetchWeatherFromBackend() {
    try {
        const response = await fetch('http://localhost:3000/api/weather/all?limit=10'); // Fetch last 10 records
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            updateChartsWithData(result.data);
        } else {
            console.log('No data found, using default initialization');
            initializeCharts(); // Fallback to empty/default charts
        }
    } catch (error) {
        console.error('❌ Error fetching from backend:', error);
        initializeCharts(); // Fallback
    }
}

function updateChartsWithData(weatherData) {
    // Process data for charts
    // We expect an array of weather records. Reverse to show oldest to newest if needed, or just take them as is (newest first).
    // Let's reverse them to show time progression if we are graphing a trend.
    const dataToChart = [...weatherData].reverse();

    // Update City Name Display
    const uniqueCities = [...new Set(dataToChart.map(item => item.city))];
    const cityDisplay = document.getElementById('chart-city-name');
    if (cityDisplay && uniqueCities.length > 0) {
        // Show the most recent city, or 'Mixed' if multiple
        const latestCity = weatherData[0].city;
        cityDisplay.textContent = `(${latestCity})`;
    }

    const labels = dataToChart.map(item => new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const temperatures = dataToChart.map(item => item.temperature);
    const humidities = dataToChart.map(item => item.humidity);
    const windSpeeds = dataToChart.map(item => item.windSpeed);

    // Count weather conditions for distribution
    const conditions = {};
    dataToChart.forEach(item => {
        const cond = item.condition || 'Unknown';
        conditions[cond] = (conditions[cond] || 0) + 1;
    });

    // Update Temperature Chart
    const tempCtx = document.getElementById('temperatureChart');
    if (tempCtx) {
        if (temperatureChart) temperatureChart.destroy();
        temperatureChart = new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(255, 215, 0, 1)',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }

    // Update Weather Distribution Chart
    const weatherCtx = document.getElementById('weatherDistChart');
    if (weatherCtx) {
        if (weatherDistChart) weatherDistChart.destroy();
        weatherDistChart = new Chart(weatherCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(conditions),
                datasets: [{
                    data: Object.values(conditions),
                    backgroundColor: [
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(135, 206, 250, 0.8)',
                        'rgba(100, 149, 237, 0.8)',
                        'rgba(176, 224, 230, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#fff' } }
                }
            }
        });
    }

    // Update Humidity & Wind Chart
    const humidityWindCtx = document.getElementById('humidityWindChart');
    if (humidityWindCtx) {
        if (humidityWindChart) humidityWindChart.destroy();
        humidityWindChart = new Chart(humidityWindCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Humidity (%)',
                        data: humidities,
                        backgroundColor: 'rgba(100, 149, 237, 0.7)'
                    },
                    {
                        label: 'Wind Speed (m/s)',
                        data: windSpeeds,
                        backgroundColor: 'rgba(255, 215, 0, 0.7)'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }
}

function initializeCharts() {
    // Keep original dummy data function as fallback, but wrapped to only run if needed
    // Copied from original file manually if needed, but for now we basically just want the backend data.
    // If backend fails, we show empty charts or basic placeholders.
    console.log("Initializing default charts (No data)");
}
