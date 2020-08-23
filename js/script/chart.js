import { setDataByPostHttpRequest, locationInfo } from './common.js';
const thisYearEmissionsEl = document.getElementById('this-year-total-emissions');
const thisYearRemainingPermissibleEmissionsEl = document.getElementById('this-year-remaining-permissible-emissions');
const expectedOverEmissionsEl = document.getElementById('expected-over-emissions');
const todayEmissionsChartEl = document.getElementById('today-emissions-chart');
const todayTotalEmissionsEl = document.getElementById('today-total-emissions');
const todayComparedToThisMonthAverageEl = document.getElementById('today-compared-to-this-month-average');
const todayComparedToThisMonthAverageArrowEl = document.getElementById('today-compared-to-this-month-average-arrow');
const yearlyMonthlySelectorEl = document.getElementById('yearly-monthly-selector');
const dateSelectorEl = document.getElementById('past-emission-chart-date-selector');
const selectedMonthChartEl = document.getElementById('selected-month-chart');
const selectedMonthTotalEmissions = document.getElementById('selected-month-total-emissions');
const selectedMonthComparedToLastYearEl = document.getElementById('selected-month-compared-to-last-year');
const selectedMonthComparedToLastYearArrowEl = document.getElementById('selected-month-compared-to-last-year-arrow');
const predictionChartEl = document.getElementById('prediction-chart');
const thisYearTotalPredictionEmissionsEl = document.getElementById('this-year-total-prediction-emissions');
const renewingPeriod = 10000;
var Interval;
(function (Interval) {
    Interval[Interval["DAILY"] = 0] = "DAILY";
    Interval[Interval["MONTHLY"] = 1] = "MONTHLY";
})(Interval || (Interval = {}));
let selectedInterval = Interval.DAILY;
function addZeroInFront(num, width) {
    const numberStr = num.toString();
    return numberStr.length >= width ? numberStr : new Array(width - numberStr.length + 1).join('0') + numberStr;
}
function renewPastEmissionsChart() {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    const year = dateString === null || dateString === void 0 ? void 0 : dateString.substring(0, 4);
    const month = dateString === null || dateString === void 0 ? void 0 : dateString.substring(5, 7);
    switch (selectedInterval) {
        case Interval.DAILY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('selectedMonthEmissions', `year=${year}&month=${month}&location=${locationInfo.location}`, (data) => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('selectedMonthComparedToLastYear', `year=${year}&month=${month}&location=${locationInfo.location}`, (data) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_a = selectedMonthComparedToLastYearEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('info-value--increase');
                        (_b = selectedMonthComparedToLastYearEl.parentElement) === null || _b === void 0 ? void 0 : _b.classList.remove('info-value--decrease');
                    }
                    else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = data.substring(1);
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        (_c = selectedMonthComparedToLastYearEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                        (_d = selectedMonthComparedToLastYearEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.add('info-value--decrease');
                    }
                    else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_e = selectedMonthComparedToLastYearEl.parentElement) === null || _e === void 0 ? void 0 : _e.classList.remove('info-value--increase');
                        (_f = selectedMonthComparedToLastYearEl.parentElement) === null || _f === void 0 ? void 0 : _f.classList.remove('info-value--decrease');
                    }
                    else {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/increase_arrow.svg';
                        (_g = selectedMonthComparedToLastYearEl.parentElement) === null || _g === void 0 ? void 0 : _g.classList.remove('info-value--decrease');
                        (_h = selectedMonthComparedToLastYearEl.parentElement) === null || _h === void 0 ? void 0 : _h.classList.add('info-value--increase');
                    }
                });
            }
            break;
        case Interval.MONTHLY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('selectedYearEmissions', `year=${year}&location=${locationInfo.location}`, (data) => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('selectedYearComparedToLastYear', `year=${year}&location=${locationInfo.location}`, (data) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_a = selectedMonthComparedToLastYearEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('info-value--increase');
                        (_b = selectedMonthComparedToLastYearEl.parentElement) === null || _b === void 0 ? void 0 : _b.classList.remove('info-value--decrease');
                    }
                    else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = data.substring(1);
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        (_c = selectedMonthComparedToLastYearEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                        (_d = selectedMonthComparedToLastYearEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.add('info-value--decrease');
                    }
                    else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_e = selectedMonthComparedToLastYearEl.parentElement) === null || _e === void 0 ? void 0 : _e.classList.remove('info-value--increase');
                        (_f = selectedMonthComparedToLastYearEl.parentElement) === null || _f === void 0 ? void 0 : _f.classList.remove('info-value--decrease');
                    }
                    else {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/increase_arrow.svg';
                        (_g = selectedMonthComparedToLastYearEl.parentElement) === null || _g === void 0 ? void 0 : _g.classList.remove('info-value--decrease');
                        (_h = selectedMonthComparedToLastYearEl.parentElement) === null || _h === void 0 ? void 0 : _h.classList.add('info-value--increase');
                    }
                });
            }
            break;
    }
}
function setEmissionChartInterval(fromDateString, monthInterval, chartEl) {
    const fromDate = new Date(fromDateString);
    let toDate;
    switch (selectedInterval) {
        case Interval.DAILY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, 1, -8, 0, -1);
            fromDate.setHours(-4);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${locationInfo.pastDailyEmissionsPanelId}`;
            break;
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${locationInfo.pastMonthlyEmissionsPanelId}`;
            break;
    }
}
function setSelectorOptions() {
    const today = new Date();
    while (dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.firstChild) {
        dateSelectorEl.removeChild(dateSelectorEl.firstChild);
    }
    switch (selectedInterval) {
        case Interval.DAILY:
            setDataByPostHttpRequest('theMostPastEmissionMonth', `location=${locationInfo.location}`, (data) => {
                if (data !== '0') {
                    const date = new Date(Number(data.substring(0, 4)), Number(data.substring(5)) - 1);
                    for (; date.valueOf() <= today.valueOf(); date.setMonth(date.getMonth() + 1)) {
                        const newOption = new Option(`${date.getFullYear()}-${addZeroInFront(date.getMonth() + 1, 2)}`, `${date.getFullYear()}-${addZeroInFront(date.getMonth() + 1, 2)}-01 00:00:00`);
                        dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.appendChild(newOption);
                        runAfterSettingSelectorOptions();
                    }
                }
                else {
                    const date = new Date();
                    const newOption = new Option(`${date.getFullYear()}-${addZeroInFront(date.getMonth() + 1, 2)}`, `${date.getFullYear()}-${addZeroInFront(date.getMonth() + 1, 2)}-01 00:00:00`);
                    dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.appendChild(newOption);
                    runAfterSettingSelectorOptions();
                }
            });
            break;
        case Interval.MONTHLY:
            setDataByPostHttpRequest('theMostPastEmissionMonth', `location=${locationInfo.location}`, (data) => {
                if (data !== '0') {
                    const date = new Date(Number(data.substring(0, 4)), 0, 1);
                    for (; date.valueOf() <= today.valueOf(); date.setFullYear(date.getFullYear() + 1)) {
                        const newOption = new Option(`${date.getFullYear()}`, `${date.getFullYear()}-01-01 00:00:00`);
                        dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.appendChild(newOption);
                        runAfterSettingSelectorOptions();
                    }
                }
                else {
                    const date = new Date();
                    const newOption = new Option(`${date.getFullYear()}`, `${date.getFullYear()}-01-01 00:00:00`);
                    dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.appendChild(newOption);
                    runAfterSettingSelectorOptions();
                }
            });
            break;
    }
}
function runAfterSettingSelectorOptions() {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    if (dateString && selectedMonthChartEl) {
        switch (selectedInterval) {
            case Interval.DAILY:
                setEmissionChartInterval(dateString, 1, selectedMonthChartEl);
                break;
            case Interval.MONTHLY:
                setEmissionChartInterval(dateString, 12, selectedMonthChartEl);
                break;
        }
    }
    renewPastEmissionsChart();
}
function renewCardValue() {
    if (thisYearEmissionsEl) {
        setDataByPostHttpRequest('thisYearEmissions', `location=${locationInfo.location}`, (data) => {
            thisYearEmissionsEl.innerText = data;
        });
    }
    if (thisYearRemainingPermissibleEmissionsEl && expectedOverEmissionsEl) {
        setDataByPostHttpRequest('thisYearRemainingPermissibleEmissions', `location=${locationInfo.location}`, (data) => {
            thisYearRemainingPermissibleEmissionsEl.innerText = data;
            setDataByPostHttpRequest('thisYearPredictionEmissions', `location=${locationInfo.location}`, (predictionData) => {
                const permissibleEmissions = Number(data.substring(0, data.length - 1));
                const predictionEmissions = Number(predictionData.substring(0, predictionData.length - 1));
                if (predictionEmissions - permissibleEmissions > 0) {
                    expectedOverEmissionsEl.innerText = predictionEmissions - permissibleEmissions + 't';
                }
                else {
                    expectedOverEmissionsEl.innerText = '0t';
                }
            });
        });
    }
}
function renewTodayEmissionChart() {
    if (todayTotalEmissionsEl) {
        setDataByPostHttpRequest('todayEmissions', `location=${locationInfo.location}`, (data) => {
            todayTotalEmissionsEl.innerText = data;
        });
    }
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByPostHttpRequest('todayComparedToThisMonthAverageEmissions', `location=${locationInfo.location}`, (data) => {
            var _a, _b, _c, _d, _e, _f;
            if (data[0] === '-') {
                todayComparedToThisMonthAverageEl.innerText = data.substring(1);
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/decrease_arrow.svg';
                (_a = todayComparedToThisMonthAverageEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('info-value--increase');
                (_b = todayComparedToThisMonthAverageEl.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add('info-value--decrease');
            }
            else if (data[0] === '0') {
                todayComparedToThisMonthAverageEl.innerText = data;
                todayComparedToThisMonthAverageArrowEl.src = '';
                (_c = todayComparedToThisMonthAverageEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                (_d = todayComparedToThisMonthAverageEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.remove('info-value--decrease');
            }
            else {
                todayComparedToThisMonthAverageEl.innerText = data;
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/increase_arrow.svg';
                (_e = todayComparedToThisMonthAverageEl.parentElement) === null || _e === void 0 ? void 0 : _e.classList.remove('info-value--decrease');
                (_f = todayComparedToThisMonthAverageEl.parentElement) === null || _f === void 0 ? void 0 : _f.classList.add('info-value--increase');
            }
        });
    }
}
function renewPredictionEmissionsChart() {
    if (thisYearTotalPredictionEmissionsEl) {
        setDataByPostHttpRequest('thisYearPredictionEmissions', `location=${locationInfo.location}`, (data) => {
            thisYearTotalPredictionEmissionsEl.innerText = data;
        });
    }
}
yearlyMonthlySelectorEl === null || yearlyMonthlySelectorEl === void 0 ? void 0 : yearlyMonthlySelectorEl.addEventListener('change', () => {
    const selectedStr = yearlyMonthlySelectorEl === null || yearlyMonthlySelectorEl === void 0 ? void 0 : yearlyMonthlySelectorEl.options[yearlyMonthlySelectorEl === null || yearlyMonthlySelectorEl === void 0 ? void 0 : yearlyMonthlySelectorEl.selectedIndex].value;
    switch (selectedStr) {
        case 'daily':
            selectedInterval = Interval.DAILY;
            break;
        case 'monthly':
            selectedInterval = Interval.MONTHLY;
            break;
    }
    setSelectorOptions();
});
dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.addEventListener('change', runAfterSettingSelectorOptions);
window.addEventListener('DOMContentLoaded', () => {
    if (todayEmissionsChartEl) {
        const today = new Date();
        today.setHours(0, 0, 0);
        todayEmissionsChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${today.valueOf()}&to=now&theme=light&panelId=${locationInfo.todayEmissionsPanelId}`;
    }
    if (predictionChartEl) {
        const today = new Date();
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), 1, 0, 0, -1);
        today.setDate(-12);
        predictionChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${today.valueOf()}&to=${nextYear.valueOf()}&theme=light&panelId=${locationInfo.predictionEmissionsPanelId}`;
    }
    setSelectorOptions();
    renewTodayEmissionChart();
    renewPredictionEmissionsChart();
    renewCardValue();
});
setInterval(renewTodayEmissionChart, renewingPeriod);
setInterval(renewPredictionEmissionsChart, renewingPeriod);
setInterval(renewCardValue, renewingPeriod);
//# sourceMappingURL=chart.js.map