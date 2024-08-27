const inputValue = document.querySelector('.input-val');
const searchBtn = document.getElementById('searchButton');
const weatherStatus = document.querySelector('.weather-status');
const notFound = document.querySelector('.not-found');
const display = document.querySelector('.display');
const temperature = document.querySelector('.weather-data');
const description = document.querySelector('.weather-data2');
const humidity = document.getElementById('humidity');
const visibility = document.getElementById('visibility');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.querySelector('.forecast');


// API Key and Base URL
const API_KEY = "d0ecbb03f90f8626c2a25cb6bb80f7d0";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";


async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Location not found');
        return await response.json();
    } catch (error) {
        console.error(error);
        notFound.style.display = "flex";
        display.style.display = "none";
        return null;
    }
}


async function fetchForecastData(city) {
    try {
        const response = await fetch(`${BASE_URL}forecast?q=${city}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Forecast data not available');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


function updateWeatherUI(weatherData) {
    notFound.style.display = "none";
    display.style.display = "flex";


    temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}<sup>°C</sup>`;
    description.innerHTML = `${weatherData.weather[0].description}`;
    visibility.innerHTML = `${weatherData.visibility / 1000} Km`;
    humidity.innerHTML = `${weatherData.main.humidity} %`;
    windSpeed.innerHTML = `${weatherData.wind.speed} Km/h`;


    updateWeatherIcon(weatherData.weather[0].main);
}


function updateWeatherIcon(weatherCondition) {
    const weatherIcons = {
        Rain: "rain.gif",
        Clouds: "cloudy.gif",
        Mist: "mist.gif",
        Snow: "snow.gif",
        Clear: "clear.gif",
        Smoke: "mist.gif",
        Haze: "mist.gif",
        Fog: "mist.gif"
    };
    weatherStatus.src = weatherIcons[weatherCondition] || "clear.gif";
}


function updateForecastUI(forecastData) {
    if (!forecastData) return;


    const forecasts = forecastData.list.filter((_, index) => index % 8 === 0); // Get one forecast per day
    forecastContainer.innerHTML = '';


    forecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dateString = `${date.getDate()}/${date.getMonth() + 1}`;
        const temp = Math.round(day.main.temp - 273.15);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;


        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${icon}.png" class="forecast-icon" alt="Weather Icon">
            <div class="forecast-date">${dateString}</div>
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${desc}</div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}


async function weatherCheck(city) {
    if (inputValue.value === '') return;


    const weatherData = await fetchWeatherData(city);
    if (weatherData) {
        updateWeatherUI(weatherData);


        const forecastData = await fetchForecastData(city);
        updateForecastUI(forecastData);
    }
}


searchBtn.addEventListener('click', () => {
    weatherCheck(inputValue.value);
});


// Optional: Fetch weather data for a default city when the page loads
document.addEventListener('DOMContentLoaded', () => {
    weatherCheck('London'); // You can set a default city here
});


