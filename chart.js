// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
});

function initializeCharts() {
    // Temperature Trend Chart
    const tempCtx = document.getElementById('temperatureChart');
    if (tempCtx) {
        const temperatureChart = new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [22, 20, 19, 23, 28, 31, 29, 25],
                    borderColor: 'rgba(255, 215, 0, 1)',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff',
                            font: {
                                size: 12,
                                family: 'Poppins'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 215, 0, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + '°C';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 11,
                                family: 'Poppins'
                            },
                            callback: function (value) {
                                return value + '°C';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 11,
                                family: 'Poppins'
                            }
                        }
                    }
                }
            }
        });
    }

    // Weather Distribution Chart
    const weatherCtx = document.getElementById('weatherDistChart');
    if (weatherCtx) {
        const weatherDistChart = new Chart(weatherCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sunny', 'Cloudy', 'Rainy', 'Windy'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(135, 206, 250, 0.8)',
                        'rgba(100, 149, 237, 0.8)',
                        'rgba(176, 224, 230, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 215, 0, 1)',
                        'rgba(135, 206, 250, 1)',
                        'rgba(100, 149, 237, 1)',
                        'rgba(176, 224, 230, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            font: {
                                size: 12,
                                family: 'Poppins'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 215, 0, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Humidity & Wind Chart
    const humidityWindCtx = document.getElementById('humidityWindChart');
    if (humidityWindCtx) {
        const humidityWindChart = new Chart(humidityWindCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Humidity (%)',
                        data: [65, 70, 68, 75, 72, 69, 71],
                        backgroundColor: 'rgba(100, 149, 237, 0.7)',
                        borderColor: 'rgba(100, 149, 237, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: 'Wind Speed (km/h)',
                        data: [15, 18, 12, 20, 16, 14, 17],
                        backgroundColor: 'rgba(255, 215, 0, 0.7)',
                        borderColor: 'rgba(255, 215, 0, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff',
                            font: {
                                size: 12,
                                family: 'Poppins'
                            },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 215, 0, 0.5)',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 11,
                                family: 'Poppins'
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 11,
                                family: 'Poppins'
                            }
                        }
                    }
                }
            }
        });
    }
}

// Function to update charts with real-time data (to be called from your weather API)
function updateCharts(weatherData) {
    // This function can be called when you fetch new weather data
    // Example usage:
    // updateCharts({
    //     temperatures: [22, 20, 19, 23, 28, 31, 29, 25],
    //     weatherDist: [40, 30, 20, 10],
    //     humidity: [65, 70, 68, 75, 72, 69, 71],
    //     windSpeed: [15, 18, 12, 20, 16, 14, 17],
    //     uvIndex: 7,
    //     aqi: 42
    // });

    if (weatherData.uvIndex) {
        document.getElementById('uvIndex').textContent = weatherData.uvIndex;
    }

    if (weatherData.aqi) {
        document.getElementById('aqiValue').textContent = weatherData.aqi;
    }
}
