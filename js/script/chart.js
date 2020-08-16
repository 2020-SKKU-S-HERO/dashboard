"use strict";
const dateSelectorEl = document.getElementById('past-emission-chart-date-selector');
const pastEmissionChartEl = document.getElementById('past-emission-chart-home');
const todayTotalEmissionsEl = document.getElementById('today-total-emissions');
const renewingPeriod = 10000;
function setEmissionChartInterval(fromDateString, monthInterval, chartEl) {
    const fromDate = new Date(fromDateString);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, 1, 12, 0, -1);
    fromDate.setHours(-12);
    chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=4`;
}
function renewValues() {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (todayTotalEmissionsEl) {
                    const responseJson = JSON.parse(httpRequest.responseText);
                    todayTotalEmissionsEl.innerText = responseJson['total_emissions'] + 't';
                }
            }
        }
    };
    httpRequest.open('GET', 'http://localhost:3000/emissions/home/todayEmissions');
    httpRequest.send(null);
}
dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.addEventListener('change', () => {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    setEmissionChartInterval(dateString, 1, pastEmissionChartEl);
});
window.addEventListener('DOMContentLoaded', () => {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[0].value;
    setEmissionChartInterval(dateString, 1, pastEmissionChartEl);
    renewValues();
});
setInterval(renewValues, renewingPeriod);
//# sourceMappingURL=chart.js.map