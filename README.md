# NEON WEATHER — Real-Time Weather Dashboard

A responsive weather dashboard built using HTML, CSS, and JavaScript that retrieves real-time weather information through RESTful APIs. The application demonstrates asynchronous JavaScript using the Fetch API, `async/await`, error handling, and dynamic JSON data rendering.

## Project Overview

NEON WEATHER is a web-based weather application that allows users to search for a city and view its current weather conditions through an interactive dashboard.

The project combines modern web development techniques with a futuristic Vaporwave and Pop-Art-inspired interface. Its visual design features neon colors, glassmorphism cards, atmospheric backgrounds, and responsive layouts.

Weather information is retrieved from the Open-Meteo API without requiring an API key for standard non-commercial use.

## Live Demo

**Live Website:** https:


## Features

- **City Search:** Search for weather information by entering a city name.
- **Real-Time Weather Data:** Retrieve current weather information using RESTful APIs.
- **Asynchronous JavaScript:** Use `async/await` and the Fetch API to handle asynchronous requests.
- **Weather Information:** Display temperature, feels-like temperature, humidity, wind speed, sunrise, and sunset.
- **Dynamic Data Rendering:** Extract and display information from nested JSON responses.
- **Error Handling:** Display appropriate messages when a city cannot be found or an API request fails.
- **Responsive Design:** Adapt the interface to desktop, tablet, and mobile screens.
- **Modern User Interface:** Use a futuristic Vaporwave-inspired theme with neon colors and glassmorphism.
- **Suggested Cities:** Provide quick-search options for selected cities.
- **Accessible Interactions:** Include semantic HTML, visible status messages, and reduced-motion support.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure and semantic markup |
| CSS3 | Styling, responsive layouts, animations, and visual effects |
| JavaScript (ES6+) | Application logic and dynamic content updates |
| Fetch API | Retrieve data from external APIs |
| Async/Await | Handle asynchronous operations |
| RESTful APIs | Access weather and geocoding information |
| JSON | Exchange and process API response data |
| Open-Meteo API | Provide weather forecasts and current conditions |
| GitHub Pages | Host and deploy the application |

## APIs Used

### 1. Open-Meteo Geocoding API

Used to find a city's geographical coordinates from its name.

**Endpoint:**

`https://geocoding-api.open-meteo.com/v1/search`

The application sends the city name to the API and retrieves matching locations, including latitude and longitude.

### 2. Open-Meteo Forecast API

Used to retrieve current weather conditions and daily sunrise and sunset information.

**Endpoint:**

`https://api.open-meteo.com/v1/forecast`

The application uses the geographical coordinates obtained from the geocoding API to request weather data for the selected location.

**Official Documentation:** https://open-meteo.com/en
