/* =========================================
   NEON WEATHER
   Asynchronous JavaScript & RESTful APIs
   ========================================= */

// Get the HTML elements we need to update.
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const message = document.getElementById("message");
const weatherDashboard = document.getElementById("weatherDashboard");
const welcomePanel = document.getElementById("welcomePanel");

const locationName = document.getElementById("locationName");
const localTime = document.getElementById("localTime");

const weatherVisual = document.getElementById("weatherVisual");
const weatherDescription = document.getElementById("weatherDescription");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const humidityBar = document.getElementById("humidityBar");

const windSpeed = document.getElementById("windSpeed");
const windBar = document.getElementById("windBar");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");


// Display a message to the user.
function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message";

    if (type) {
        message.classList.add(type);
    }
}


// Weather information for different weather codes.
function getWeatherDetails(code, isDay) {

    if (code === 0) {
        return {
            description: "Clear Sky",
            icon: isDay ? "☀" : "☾"
        };
    }

    if (code === 1) {
        return {
            description: "Mainly Clear",
            icon: isDay ? "🌤" : "☾"
        };
    }

    if (code === 2) {
        return {
            description: "Partly Cloudy",
            icon: "⛅"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            description: "Foggy Atmosphere",
            icon: "🌫"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            description: "Drizzle",
            icon: "🌦"
        };
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return {
            description: "Rainy Weather",
            icon: "🌧"
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            description: "Snowfall",
            icon: "❄"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            description: "Rain Showers",
            icon: "🌧"
        };
    }

    if ([85, 86].includes(code)) {
        return {
            description: "Snow Showers",
            icon: "🌨"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            description: "Thunderstorm",
            icon: "ϟ"
        };
    }

    return {
        description: "Weather Unavailable",
        icon: "✧"
    };
}


// Convert a time string into a readable local time.
function formatTime(timeString) {

    if (!timeString) {
        return "--:--";
    }

    const timePart = timeString.split("T")[1];

    if (!timePart) {
        return "--:--";
    }

    const parts = timePart.split(":");

    let hours = Number(parts[0]);
    const minutes = parts[1];

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}


// Fetch weather information for a city.
async function getWeather(city) {

    // Prevent the form from being submitted repeatedly.
    searchButton.disabled = true;
    searchButton.textContent = "LOADING...";

    showMessage("Connecting to the atmospheric network...");

    try {

        // STEP 1: Search for the city using geocoding.
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            `?name=${encodeURIComponent(city)}` +
            "&count=10&language=en&format=json";

        const geoResponse = await fetch(geoURL);

        // Check whether the request was successful.
        if (!geoResponse.ok) {
            throw new Error("Unable to search for this city.");
        }

        // Convert the JSON response into a JavaScript object.
        const geoData = await geoResponse.json();

        // Check whether the city exists.
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(
                "City not found. Please check the spelling and try again."
            );
        }

        // Prefer an exact city-name match when possible.
        const cityData = geoData.results.find(
            item => item.name.toLowerCase() === city.toLowerCase()
        ) || geoData.results[0];

        const latitude = cityData.latitude;
        const longitude = cityData.longitude;

        // STEP 2: Request current weather and daily sunrise/sunset.
        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=temperature_2m,relative_humidity_2m," +
            "apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m" +
            "&daily=sunrise,sunset" +
            "&timezone=auto" +
            "&forecast_days=1";

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        // STEP 3: Convert the weather response from JSON.
        const weatherData = await weatherResponse.json();

        // Check that the expected information exists.
        if (!weatherData.current || !weatherData.daily) {
            throw new Error("The weather service returned incomplete data.");
        }

        // STEP 4: Display the weather information.
        displayWeather(cityData, weatherData);

        showMessage(
            "Weather data updated successfully.",
            "success"
        );

    } catch (error) {

        // Handle invalid cities, network failures, and API errors.
        console.error("Weather request failed:", error);

        showMessage(
            error instanceof TypeError
                ? "Network error. Check your internet connection and try again."
                : error.message || "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        // Restore the search button even when an error occurs.
        searchButton.disabled = false;
        searchButton.innerHTML = 'EXPLORE <span aria-hidden="true">↗</span>';

    }
}


// Update the page using the weather data.
function displayWeather(cityData, data) {

    const current = data.current;
    const daily = data.daily;

    // Display city and country.
    locationName.textContent =
        `${cityData.name}, ${cityData.country || cityData.admin1 || ""}`
        .replace(/,\s*$/, "");

    // Display the local date and time returned by the API.
    localTime.textContent =
        `LOCAL TIME: ${current.time.replace("T", " ")}`;

    // Get the weather description and icon.
    const weather = getWeatherDetails(
        current.weather_code,
        current.is_day
    );

    weatherDescription.textContent = weather.description;
    weatherVisual.textContent = weather.icon;

    // Display temperature.
    temperature.textContent =
        Math.round(current.temperature_2m);

    // Display the apparent temperature.
    feelsLike.textContent =
        `Feels like ${Math.round(current.apparent_temperature)}°C`;

    // Display humidity and update its progress bar.
    humidity.textContent =
        current.relative_humidity_2m;

    humidityBar.style.width =
        `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%`;

    // Convert wind speed from metres per second where necessary.
    // Open-Meteo returns km/h by default for this request.
    windSpeed.textContent =
        Number(current.wind_speed_10m).toFixed(1);

    // Scale the wind indicator visually.
    windBar.style.width =
        `${Math.min(100, Math.max(0, current.wind_speed_10m * 2))}%`;

    // Display sunrise and sunset in the city's local time.
    sunrise.textContent =
        formatTime(daily.sunrise?.[0]);

    sunset.textContent =
        formatTime(daily.sunset?.[0]);

    // Reveal the weather dashboard.
    weatherDashboard.hidden = false;
    welcomePanel.hidden = true;
}


// Listen for a search form submission.
searchForm.addEventListener("submit", function (event) {

    // Stop the browser from reloading the page.
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name.", "error");
        cityInput.focus();
        return;
    }

    getWeather(city);
});


// Allow the suggested-city buttons to perform searches.
document.querySelectorAll(".city-chip").forEach(button => {

    button.addEventListener("click", function () {

        const city = this.dataset.city;

        cityInput.value = city;

        getWeather(city);

    });

});