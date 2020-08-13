"use strict";
const dateSelectorEl = document.getElementById('past-emission-chart-date-selector');
const pastEmissionChartEl = document.getElementById('past-emission-chart-home');
dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.addEventListener('change', () => {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    const fromDate = new Date(dateString);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1, 0, 0, -1);
    console.log(fromDate);
    console.log(toDate);
    pastEmissionChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=4`;
});
window.addEventListener('DOMContentLoaded', () => {
    const fromDate = new Date(2020, 0, 1);
    const toDate = new Date(2020, 1, 1, 0, 0, -1);
    pastEmissionChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=4`;
});
//# sourceMappingURL=chart.js.map