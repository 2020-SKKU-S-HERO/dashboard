import { setDataByPostHttpRequest, locationInfo } from './common.js';

const weatherIconEl: HTMLImageElement | null = <HTMLImageElement>document.getElementById('weather-icon');
const temperatureValueEl: HTMLElement | null = document.getElementById('temperature-value');
const humidityValueEl: HTMLElement | null = document.getElementById('humidity-value');

const renewingPeriod: number = 60000;

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
    if (weatherIconEl && temperatureValueEl && humidityValueEl) {
        setDataByPostHttpRequest('weather', `cityName=${ locationInfo.cityName }`, (data: string): void => {
            const weatherData: any = JSON.parse(data);
            
            weatherIconEl.src = `http://openweathermap.org/img/wn/${ weatherData.weather_icon }@2x.png`;
            temperatureValueEl.innerText = (weatherData.temperature - 273.15).toFixed(1) + '°';
            humidityValueEl.innerText = weatherData.humidity + '%';
        });
    }
}

window.addEventListener('DOMContentLoaded', (): void => {
    renewWeather();
});

setInterval(renewWeather, renewingPeriod);