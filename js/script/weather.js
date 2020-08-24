import { setDataByPostHttpRequest, locationInfo } from './common.js';
const weatherIconEl = document.getElementById('weather-icon');
const temperatureValueEl = document.getElementById('temperature-value');
const humidityValueEl = document.getElementById('humidity-value');
const renewingPeriod = 60000;
function renewWeather() {
    if (weatherIconEl && temperatureValueEl && humidityValueEl) {
        setDataByPostHttpRequest('weather', `cityName=${locationInfo.cityName}`, (data) => {
            const weatherData = JSON.parse(data);
            weatherIconEl.src = `http://openweathermap.org/img/wn/${weatherData.weather_icon.substring(0, 2) + 'd'}@2x.png`;
            temperatureValueEl.innerText = (weatherData.temperature - 273.15).toFixed(1) + '°';
            humidityValueEl.innerText = weatherData.humidity + '%';
        });
    }
}
window.addEventListener('DOMContentLoaded', () => {
    renewWeather();
});
setInterval(renewWeather, renewingPeriod);
//# sourceMappingURL=weather.js.map