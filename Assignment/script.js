// Dark Mode Toggle
const themeToggleButton = document.createElement('button');
themeToggleButton.innerText = "🌞 Light Mode";
themeToggleButton.className = "theme-toggle";
themeToggleButton.onclick = toggleTheme;
document.body.prepend(themeToggleButton);

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    themeToggleButton.innerText = document.body.classList.contains("dark-mode") ? "🌜 Dark Mode" : "🌞 Light Mode";
}

// Get elements from the DOM
const searchButton = document.getElementById('search-btn');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const windSpeed = document.getElementById('wind-speed');

// Open-Meteo API URL for current weather (using coordinates for the city)
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast";

// OpenCage Geocoding API URL to get latitude and longitude of the city
const geocodingApiUrl = "https://api.opencagedata.com/geocode/v1/json";
const geocodingApiKey = "639aea6fa0084776a95e862160de4e42 "; // Replace with your OpenCage API key

// Fetch weather data when the search button is clicked
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        weatherResult.style.display = "none";
        return;
    }

    errorMessage.textContent = "";
    
    fetchCoordinates(city);
});

// Function to fetch coordinates from OpenCage Geocoding API
async function fetchCoordinates(city) {
    try {
        const response = await fetch(`${geocodingApiUrl}?q=${city}&key=${geocodingApiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;

            // Once we have the coordinates, fetch the weather data
            fetchWeather(lat, lon, city);
        } else {
            errorMessage.textContent = "City not found. Please try again.";
            weatherResult.style.display = "none";
        }
    } catch (error) {
        // Handle any errors that occur during the geocoding request
        errorMessage.textContent = "Error fetching coordinates. Please try again later.";
        weatherResult.style.display = "none";
    }
}

// Function to fetch weather data from Open-Meteo API using coordinates
async function fetchWeather(lat, lon, city) {
    try {
        // Fetch weather data from Open-Meteo API
        const response = await fetch(`${weatherApiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();

        if (data && data.current_weather) {
            // Display weather information
            cityName.textContent = city;
            weatherDescription.textContent = `Weather: ${data.current_weather.weathercode}`;
            temperature.textContent = `Temperature: ${data.current_weather.temperature}°C`;
            windSpeed.textContent = `Wind Speed: ${data.current_weather.windspeed} km/h`;

            // Show the weather result
            weatherResult.style.display = "block";
        } else {
            // Show error if no weather data is found
            errorMessage.textContent = "Weather data not available for the given city.";
            weatherResult.style.display = "none";
        }
    } catch (error) {
        // Handle errors that occur during the weather request
        errorMessage.textContent = "Failed to fetch weather data. Please try again later.";
        weatherResult.style.display = "none";
    }
}
