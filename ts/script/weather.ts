import { setDataByPostHttpRequest, locationInfo } from './common.js';

const weatherValueEl: HTMLElement | null = document.getElementById('weather-value');
const temperatureValueEl: HTMLElement | null = document.getElementById('temperature-value');
const humidityValueEl: HTMLElement | null = document.getElementById('humidity-value');

enum Weather {
    SUNNY,
    PARTLY_CLOUDY,
    RAINY,
    THUNDERSTORMS,
    SNOWY,
    CLOUDY,
    FOGGY
}

function renewWeather(): void {
    if (weatherValueEl && temperatureValueEl && humidityValueEl) {
        setDataByPostHttpRequest('weather', `cityName=${ locationInfo.cityName }`, (data: string): void => {
            const weatherData: JSON = JSON.parse(data);
    
            console.log(weatherData);
            
            weatherValueEl.innerText = weatherData.weather;
            temperatureValueEl.innerText =(weatherData.temperature - 273.15).toFixed(1) + '°C';
            humidityValueEl.innerText = weatherData.humidity + '%';
        });
    }
}

window.addEventListener('DOMContentLoaded', (): void => {
    renewWeather();
});