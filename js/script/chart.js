import { setDataByPostHttpRequest, locationInfo, info, gcpInfo } from './common.js';
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
const recentTwoMonthsPredictionAverageErrorEl = document.getElementById('recent-two-months-prediction-average-error');
const thisYearEmissionsOfLocation1El = document.getElementById('location1-this-year-emissions');
const thisYearEmissionsOfLocation2El = document.getElementById('location2-this-year-emissions');
const thisYearEmissionsOfLocation3El = document.getElementById('location3-this-year-emissions');
const contributionOfLocation1El = document.getElementById('location1-contribution');
const contributionOfLocation2El = document.getElementById('location2-contribution');
const contributionOfLocation3El = document.getElementById('location3-contribution');
const resourceChartEl = document.getElementById('resource-chart');
const resourceRatioEl = document.getElementById('resource-ratio');
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
function abbreviateNumber(num) {
    let abbreviatedNum;
    let abbreviatedStr;
    let unit;
    if (num >= 1000000000) {
        abbreviatedNum = num / 1000000000;
        unit = 'b';
    }
    else if (num >= 1000000) {
        abbreviatedNum = num / 1000000;
        unit = 'm';
    }
    else if (num >= 1000) {
        abbreviatedNum = num / 1000;
        unit = 'k';
    }
    else if (num > 0) {
        abbreviatedNum = num;
        unit = '';
    }
    else {
        return '0';
    }
    abbreviatedStr = abbreviatedNum.toFixed(2);
    if (abbreviatedStr.length >= 6) {
        abbreviatedStr = abbreviatedStr.replace(/\.(\S*)/, '');
    }
    else if (abbreviatedStr.length == 5) {
        abbreviatedStr = Number(abbreviatedStr).toFixed(1);
    }
    return abbreviatedStr + unit;
}
function addCommaInNumber(num) {
    const sign = num < 0 ? '-' : '';
    const numberStr = num.toFixed(0);
    let resultStr = '';
    const point = numberStr.length % 3;
    let pos = 0;
    while (pos < numberStr.length) {
        if (pos % 3 === point && pos !== 0) {
            resultStr += ',';
        }
        ``;
        resultStr += numberStr[pos];
        pos++;
    }
    return sign + resultStr;
}
function renewPastEmissionsChart() {
    const dateString = dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.options[dateSelectorEl === null || dateSelectorEl === void 0 ? void 0 : dateSelectorEl.selectedIndex].value;
    const year = dateString === null || dateString === void 0 ? void 0 : dateString.substring(0, 4);
    const month = dateString === null || dateString === void 0 ? void 0 : dateString.substring(5, 7);
    switch (selectedInterval) {
        case Interval.DAILY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('selectedMonthEmissions', `year=${year}&month=${month}&location=${locationInfo.location}`, (data) => {
                    selectedMonthTotalEmissions.innerText = abbreviateNumber(Number(data)) + ' t';
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
                        selectedMonthComparedToLastYearEl.innerText = Number(data.substring(1)).toFixed(1) + '%';
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        (_c = selectedMonthComparedToLastYearEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                        (_d = selectedMonthComparedToLastYearEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.add('info-value--decrease');
                    }
                    else if (data === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data + '%';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_e = selectedMonthComparedToLastYearEl.parentElement) === null || _e === void 0 ? void 0 : _e.classList.remove('info-value--increase');
                        (_f = selectedMonthComparedToLastYearEl.parentElement) === null || _f === void 0 ? void 0 : _f.classList.remove('info-value--decrease');
                    }
                    else {
                        selectedMonthComparedToLastYearEl.innerText = Number(data).toFixed(1) + '%';
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
                    selectedMonthTotalEmissions.innerText = abbreviateNumber(Number(data)) + ' t';
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
                        selectedMonthComparedToLastYearEl.innerText = Number(data.substring(1)).toFixed(1) + '%';
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        (_c = selectedMonthComparedToLastYearEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                        (_d = selectedMonthComparedToLastYearEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.add('info-value--decrease');
                    }
                    else if (data === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data + '%';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        (_e = selectedMonthComparedToLastYearEl.parentElement) === null || _e === void 0 ? void 0 : _e.classList.remove('info-value--increase');
                        (_f = selectedMonthComparedToLastYearEl.parentElement) === null || _f === void 0 ? void 0 : _f.classList.remove('info-value--decrease');
                    }
                    else {
                        selectedMonthComparedToLastYearEl.innerText = Number(data).toFixed(1) + '%';
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
            chartEl.src = `http://${gcpInfo.ip}:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=1m&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${locationInfo.pastDailyEmissionsPanelId}`;
            break;
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://${gcpInfo.ip}:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=1m&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=${locationInfo.pastMonthlyEmissionsPanelId}`;
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
                    const theMostPastDate = new Date(Number(data.substring(0, 4)), Number(data.substring(5)) - 1, 1);
                    const date = new Date(today.getFullYear(), today.getMonth(), 1);
                    for (; date.valueOf() >= theMostPastDate.valueOf(); date.setMonth(date.getMonth() - 1)) {
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
                    const theMostPastDate = new Date(Number(data.substring(0, 4)), 0, 1);
                    const date = new Date(today.getFullYear(), 0, 1);
                    for (; date.valueOf() >= theMostPastDate.valueOf(); date.setFullYear(date.getFullYear() - 1)) {
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
            thisYearEmissionsEl.innerText = abbreviateNumber(Number(data)) + ' t';
        });
    }
    if (thisYearRemainingPermissibleEmissionsEl && expectedOverEmissionsEl) {
        setDataByPostHttpRequest('thisYearRemainingPermissibleEmissions', `location=${locationInfo.location}`, (data) => {
            if (Number(data) > 0) {
                thisYearRemainingPermissibleEmissionsEl.innerText = abbreviateNumber(Number(data)) + ' t';
            }
            else {
                thisYearRemainingPermissibleEmissionsEl.innerText = '0 t';
            }
            setDataByPostHttpRequest('thisYearPredictionEmissions', `location=${locationInfo.location}`, (predictionData) => {
                const permissibleEmissions = Number(data);
                const predictionEmissions = Number(predictionData);
                if (predictionEmissions - permissibleEmissions > 0) {
                    expectedOverEmissionsEl.innerText = abbreviateNumber(predictionEmissions - permissibleEmissions) + ' t';
                }
                else {
                    expectedOverEmissionsEl.innerText = '0 t';
                }
            });
        });
    }
}
function renewTodayEmissionChart() {
    if (todayTotalEmissionsEl) {
        setDataByPostHttpRequest('todayEmissions', `location=${locationInfo.location}`, (data) => {
            todayTotalEmissionsEl.innerText = abbreviateNumber(Number(data)) + ' t';
        });
    }
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByPostHttpRequest('todayComparedToThisMonthAverageEmissions', `location=${locationInfo.location}`, (data) => {
            var _a, _b, _c, _d, _e, _f;
            if (data[0] === '-') {
                todayComparedToThisMonthAverageEl.innerText = Number(data.substring(1)).toFixed(1) + '%';
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/decrease_arrow.svg';
                (_a = todayComparedToThisMonthAverageEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('info-value--increase');
                (_b = todayComparedToThisMonthAverageEl.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add('info-value--decrease');
            }
            else if (data === '0') {
                todayComparedToThisMonthAverageEl.innerText = data + '%';
                todayComparedToThisMonthAverageArrowEl.src = '';
                (_c = todayComparedToThisMonthAverageEl.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('info-value--increase');
                (_d = todayComparedToThisMonthAverageEl.parentElement) === null || _d === void 0 ? void 0 : _d.classList.remove('info-value--decrease');
            }
            else {
                todayComparedToThisMonthAverageEl.innerText = Number(data).toFixed(1) + '%';
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
            thisYearTotalPredictionEmissionsEl.innerText = abbreviateNumber(Number(data)) + ' t';
        });
    }
    if (recentTwoMonthsPredictionAverageErrorEl) {
        setDataByPostHttpRequest('predictionAverageError', `location=${locationInfo.location}`, (data) => {
            recentTwoMonthsPredictionAverageErrorEl.innerText = abbreviateNumber(Number(data)) + ' t';
        });
    }
}
function renewContributionChart() {
    if (thisYearEmissionsOfLocation1El && thisYearEmissionsOfLocation2El && thisYearEmissionsOfLocation3El && contributionOfLocation1El && contributionOfLocation2El && contributionOfLocation3El) {
        setDataByPostHttpRequest('thisYearEmissions', `location=${info.workplace1.location}`, (data1) => {
            setDataByPostHttpRequest('thisYearEmissions', `location=${info.workplace2.location}`, (data2) => {
                setDataByPostHttpRequest('thisYearEmissions', `location=${info.workplace3.location}`, (data3) => {
                    const emissionsOfLocation1 = Number(data1);
                    const emissionsOfLocation2 = Number(data2);
                    const emissionsOfLocation3 = Number(data3);
                    const sumOfEmissions = emissionsOfLocation1 + emissionsOfLocation2 + emissionsOfLocation3;
                    const contributionOfLocation1 = emissionsOfLocation1 / sumOfEmissions * 100;
                    const contributionOfLocation2 = emissionsOfLocation2 / sumOfEmissions * 100;
                    const contributionOfLocation3 = emissionsOfLocation3 / sumOfEmissions * 100;
                    thisYearEmissionsOfLocation1El.innerText = abbreviateNumber(emissionsOfLocation1) + ' t';
                    thisYearEmissionsOfLocation2El.innerText = abbreviateNumber(emissionsOfLocation2) + ' t';
                    thisYearEmissionsOfLocation3El.innerText = abbreviateNumber(emissionsOfLocation3) + ' t';
                    contributionOfLocation1El.innerText = contributionOfLocation1.toFixed(1) + '%';
                    contributionOfLocation2El.innerText = contributionOfLocation2.toFixed(1) + '%';
                    contributionOfLocation3El.innerText = contributionOfLocation3.toFixed(1) + '%';
                });
            });
        });
    }
}
function renewResourceChart() {
    if (resourceRatioEl) {
        setDataByPostHttpRequest('resourceRatio', `location=${locationInfo.location}`, (data) => {
            resourceRatioEl.innerText = data;
        });
    }
}
window.addEventListener('DOMContentLoaded', () => {
    if (todayEmissionsChartEl) {
        const today = new Date();
        today.setHours(0, 0, 0);
        todayEmissionsChartEl.src = `http://${gcpInfo.ip}:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=10s&from=${today.valueOf()}&to=now&theme=light&panelId=${locationInfo.todayEmissionsPanelId}`;
    }
    if (predictionChartEl) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
        today.setDate(-12);
        predictionChartEl.src = `http://${gcpInfo.ip}:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=10s&from=${firstDay.valueOf()}&to=${lastDay.valueOf()}&theme=light&panelId=${locationInfo.predictionEmissionsPanelId}`;
    }
    if (resourceChartEl) {
        const today = new Date();
        today.setHours(0, 0, 0);
        resourceChartEl.src = `http://${gcpInfo.ip}:3000/d-solo/zze7bhDMk/resource?orgId=1&refresh=10s&from=${today.valueOf()}&to=now&theme=light&panelId=${locationInfo.resourcePanelId}`;
    }
    setSelectorOptions();
    renewTodayEmissionChart();
    renewPredictionEmissionsChart();
    renewCardValue();
    renewContributionChart();
    renewResourceChart();
});
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
setInterval(renewTodayEmissionChart, renewingPeriod);
setInterval(renewPredictionEmissionsChart, renewingPeriod);
setInterval(renewCardValue, renewingPeriod);
setInterval(renewContributionChart, renewingPeriod);
setInterval(renewResourceChart, renewingPeriod);
//# sourceMappingURL=chart.js.map