import { setDataByPostHttpRequest, locationInfo } from './common.js';
const weatherIconEl = document.getElementById('weather-icon');
const temperatureValueEl = document.getElementById('temperature-value');
const humidityValueEl = document.getElementById('humidity-value');
const renewingPeriod = 60000;
var Weather;
(function (Weather) {
    Weather[Weather["SUNNY"] = 0] = "SUNNY";
    Weather[Weather["PARTLY_CLOUDY"] = 1] = "PARTLY_CLOUDY";
    Weather[Weather["RAINY"] = 2] = "RAINY";
    Weather[Weather["THUNDERSTORMS"] = 3] = "THUNDERSTORMS";
    Weather[Weather["SNOWY"] = 4] = "SNOWY";
    Weather[Weather["CLOUDY"] = 5] = "CLOUDY";
    Weather[Weather["FOGGY"] = 6] = "FOGGY";
})(Weather || (Weather = {}));
function renewWeather() {
    if (weatherIconEl && temperatureValueEl && humidityValueEl) {
        setDataByPostHttpRequest('weather', `cityName=${locationInfo.cityName}`, (data) => {
            const weatherData = JSON.parse(data);
            weatherIconEl.src = `http://openweathermap.org/img/wn/${weatherData.weather_icon}@2x.png`;
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