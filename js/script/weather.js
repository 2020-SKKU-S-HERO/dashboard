import { setDataByPostHttpRequest, locationInfo } from './common.js';
const weatherValueEl = document.getElementById('weather-value');
const temperatureValueEl = document.getElementById('temperature-value');
const humidityValueEl = document.getElementById('humidity-value');
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
    if (weatherValueEl && temperatureValueEl && humidityValueEl) {
        setDataByPostHttpRequest('weather', `cityName=${locationInfo.cityName}`, (data) => {
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            weatherValueEl.innerText = weatherData.weather;
            temperatureValueEl.innerText = (weatherData.temperature - 273.15).toFixed(1) + '°C';
            humidityValueEl.innerText = weatherData.humidity + '%';
        });
    }
}
window.addEventListener('DOMContentLoaded', () => {
    renewWeather();
});
//# sourceMappingURL=weather.js.map