"use strict";
const thisYearEmissionsEl = document.getElementById('this-year-total-emissions');
const thisYearRemainingPermissibleEmissionsEl = document.getElementById('this-year-remaining-permissible-emissions');
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
const isHome = document.getElementById('emissions-home');
const isWorkplace1 = document.getElementById('emissions-workplace1');
const isWorkplace2 = document.getElementById('emissions-workplace2');
const isWorkplace3 = document.getElementById('emissions-workplace3');
const workplace1 = 'location1';
const workplace2 = 'location2';
const workplace3 = 'location3';
const renewingPeriod = 10000;
var Interval;
(function (Interval) {
    Interval[Interval["DAILY"] = 0] = "DAILY";
    Interval[Interval["MONTHLY"] = 1] = "MONTHLY";
})(Interval || (Interval = {}));
let locationToPost;
let todayEmissionsPanelId;
let pastDailyEmissionsPanelId;
let pastMonthlyEmissionsPanelId;
let predictionEmissionsPanelId;
let selectedInterval = Interval.DAILY;
function addZeroInFront(num, width) {
    const numberStr = num.toString();
    return numberStr.length >= width ? numberStr : new Array(width - numberStr.length + 1).join('0') + numberStr;
}
function setDataByGetHttpRequest(url, onGetData) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                onGetData(httpRequest.responseText);
            }
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send(null);
}
function setDataByPostHttpRequest(url, dataToSend, onGetData) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                onGetData(httpRequest.responseText);
            }
        }
    };
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(dataToSend + `&location=${locationToPost}`);
}
function renewPastEmissionsChart() {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    const year = dateString === null || dateString === void 0 ? void 0 : dateString.substring(0, 4);
    const month = dateString === null || dateString === void 0 ? void 0 : dateString.substring(5, 7);
    switch (selectedInterval) {
        case Interval.DAILY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('home/selectedMonthEmissions', `year=${year}&month=${month}`, (data) => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('home/selectedMonthComparedToLastYear', `year=${year}&month=${month}`, (data) => {
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
                setDataByPostHttpRequest('home/selectedYearEmissions', `year=${year}`, (data) => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('home/selectedYearComparedToLastYear', `year=${year}`, (data) => {
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
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${pastDailyEmissionsPanelId}`;
            break;
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${pastMonthlyEmissionsPanelId}`;
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
            setDataByPostHttpRequest('home/theMostPastEmissionMonth', null, (data) => {
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
            setDataByPostHttpRequest('home/theMostPastEmissionMonth', null, (data) => {
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
function renewTodayEmissionChart() {
    if (todayTotalEmissionsEl) {
        setDataByPostHttpRequest('home/todayEmissions', null, (data) => {
            todayTotalEmissionsEl.innerText = data;
        });
    }
    if (thisYearEmissionsEl) {
        setDataByPostHttpRequest('home/thisYearEmissions', null, (data) => {
            thisYearEmissionsEl.innerText = data;
        });
    }
    if (thisYearRemainingPermissibleEmissionsEl) {
        setDataByPostHttpRequest('home/thisYearRemainingPermissibleEmissions', null, (data) => {
            thisYearRemainingPermissibleEmissionsEl.innerText = data;
        });
    }
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByPostHttpRequest('home/todayComparedToThisMonthAverageEmissions', null, (data) => {
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
        todayEmissionsChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${today.valueOf()}&to=now&theme=light&panelId=${todayEmissionsPanelId}`;
    }
    setSelectorOptions();
    renewTodayEmissionChart();
});
if (isHome) {
    locationToPost = '';
    todayEmissionsPanelId = 2;
    pastDailyEmissionsPanelId = 4;
    pastMonthlyEmissionsPanelId = 6;
    predictionEmissionsPanelId = 0;
}
else if (isWorkplace1) {
    locationToPost = workplace1;
    todayEmissionsPanelId = 8;
    pastDailyEmissionsPanelId = 12;
    pastMonthlyEmissionsPanelId = 13;
    predictionEmissionsPanelId = 0;
}
else if (isWorkplace2) {
    locationToPost = workplace2;
    todayEmissionsPanelId = 9;
    pastDailyEmissionsPanelId = 16;
    pastMonthlyEmissionsPanelId = 17;
    predictionEmissionsPanelId = 0;
}
else if (isWorkplace3) {
    locationToPost = workplace3;
    todayEmissionsPanelId = 10;
    pastDailyEmissionsPanelId = 18;
    pastMonthlyEmissionsPanelId = 19;
    predictionEmissionsPanelId = 0;
}
setInterval(renewTodayEmissionChart, renewingPeriod);
//# sourceMappingURL=chart.js.map