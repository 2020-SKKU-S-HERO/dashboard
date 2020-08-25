import { setDataByPostHttpRequest, locationInfo, info } from './common.js';

// 상단 카드
const thisYearEmissionsEl: HTMLElement | null = document.getElementById('this-year-total-emissions');
const thisYearRemainingPermissibleEmissionsEl: HTMLElement | null = document.getElementById('this-year-remaining-permissible-emissions');
const expectedOverEmissionsEl: HTMLElement | null = document.getElementById('expected-over-emissions');

// 오늘 배출량
const todayEmissionsChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('today-emissions-chart');
const todayTotalEmissionsEl: HTMLElement | null = document.getElementById('today-total-emissions');
const todayComparedToThisMonthAverageEl: HTMLElement | null = document.getElementById('today-compared-to-this-month-average');
const todayComparedToThisMonthAverageArrowEl: HTMLImageElement | null = <HTMLImageElement>document.getElementById('today-compared-to-this-month-average-arrow');

// 이전 배출량
const yearlyMonthlySelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('yearly-monthly-selector');
const dateSelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('past-emission-chart-date-selector');
const selectedMonthChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('selected-month-chart');
const selectedMonthTotalEmissions: HTMLElement | null = document.getElementById('selected-month-total-emissions');
const selectedMonthComparedToLastYearEl: HTMLElement | null = document.getElementById('selected-month-compared-to-last-year');
const selectedMonthComparedToLastYearArrowEl: HTMLImageElement | null = <HTMLImageElement>document.getElementById('selected-month-compared-to-last-year-arrow');

// 예측 배출량
const predictionChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('prediction-chart');
const thisYearTotalPredictionEmissionsEl: HTMLElement | null = document.getElementById('this-year-total-prediction-emissions');

// 기여도 분석
const thisYearEmissionsOfLocation1El: HTMLElement | null = document.getElementById('location1-this-year-emissions');
const thisYearEmissionsOfLocation2El: HTMLElement | null = document.getElementById('location2-this-year-emissions');
const thisYearEmissionsOfLocation3El: HTMLElement | null = document.getElementById('location3-this-year-emissions');

const contributionOfLocation1El: HTMLElement | null = document.getElementById('location1-contribution');
const contributionOfLocation2El: HTMLElement | null = document.getElementById('location2-contribution');
const contributionOfLocation3El: HTMLElement | null = document.getElementById('location3-contribution');


// 갱신 주기
const renewingPeriod: number = 10000;

enum Interval {
    DAILY,
    MONTHLY
}

let selectedInterval: Interval = Interval.DAILY;

function addZeroInFront(num: number, width: number): string {
    const numberStr: string = num.toString();
    
    return numberStr.length >= width ? numberStr : new Array(width - numberStr.length + 1).join('0') + numberStr;
}

function addCommaInNumber(num: number): string {
    const sign: string = num < 0 ? '-' : '';
    const numberStr: string = Math.abs(num).toString();
    let resultStr: string = '';
    const point: number = numberStr.length % 3;
    let pos: number = 0;
    
    while (pos < numberStr.length) {
        if (pos % 3 === point && pos !== 0) {
            resultStr += ',';
        }``
        
        resultStr += numberStr[pos];
        pos++;
    }
    
    return sign + resultStr;
}

function renewPastEmissionsChart(): void {
    const dateString: string | undefined = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    const year: string | undefined = dateString?.substring(0, 4);
    const month: string | undefined = dateString?.substring(5, 7);
    
    switch (selectedInterval) {
        case Interval.DAILY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('selectedMonthEmissions', `year=${ year }&month=${ month }&location=${ locationInfo.location }`, (data: string): void => {
                    selectedMonthTotalEmissions.innerText = addCommaInNumber(Number(data)) + ' t';
                });
            }
            
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('selectedMonthComparedToLastYear', `year=${ year }&month=${ month }&location=${ locationInfo.location }`, (data: string): void => {
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = Number(data.substring(1)).toFixed(1) + '%';
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--decrease');
                    } else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data + '%';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else {
                        selectedMonthComparedToLastYearEl.innerText = Number(data).toFixed(1) + '%';
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/increase_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--increase');
                    }
                });
            }
            break;
        
        case Interval.MONTHLY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('selectedYearEmissions', `year=${ year }&location=${ locationInfo.location }`, (data: string): void => {
                    selectedMonthTotalEmissions.innerText = addCommaInNumber(Number(data)) + ' t';
                });
            }
            
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('selectedYearComparedToLastYear', `year=${ year }&location=${ locationInfo.location }`, (data: string): void => {
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = Number(data.substring(1)).toFixed(1) + '%'
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--decrease');
                    } else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data + '%';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else {
                        selectedMonthComparedToLastYearEl.innerText = Number(data).toFixed(1) + '%';
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/increase_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--increase');
                    }
                });
            }
            break;
    }
}

function setEmissionChartInterval(fromDateString: string, monthInterval: number, chartEl: HTMLIFrameElement): void {
    const fromDate: Date = new Date(fromDateString);
    let toDate: Date;
    
    switch (selectedInterval) {
        case Interval.DAILY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, 1, -8, 0, -1);
            fromDate.setHours(-4);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=${ locationInfo.pastDailyEmissionsPanelId }`;
            break;
        
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=${ locationInfo.pastMonthlyEmissionsPanelId }`;
            break;
    }
}

function setSelectorOptions(): void {
    const today: Date = new Date();
    
    while (dateSelectorEl?.firstChild) {
        dateSelectorEl.removeChild(dateSelectorEl.firstChild);
    }
    
    switch (selectedInterval) {
        case Interval.DAILY:
            setDataByPostHttpRequest('theMostPastEmissionMonth', `location=${ locationInfo.location }`, (data: string): void => {
                if (data !== '0') {
                    const date: Date = new Date(Number(data.substring(0, 4)), Number(data.substring(5)) - 1);
                    
                    for (; date.valueOf() <= today.valueOf(); date.setMonth(date.getMonth() + 1)) {
                        const newOption: HTMLOptionElement = new Option(`${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }`, `${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }-01 00:00:00`);
                        
                        dateSelectorEl?.appendChild(newOption);
                        
                        runAfterSettingSelectorOptions();
                    }
                } else {
                    const date: Date = new Date();
                    const newOption: HTMLOptionElement = new Option(`${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }`, `${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }-01 00:00:00`);
                    
                    dateSelectorEl?.appendChild(newOption);
                    
                    runAfterSettingSelectorOptions();
                }
            });
            break;
        
        case Interval.MONTHLY:
            setDataByPostHttpRequest('theMostPastEmissionMonth', `location=${ locationInfo.location }`, (data: string): void => {
                if (data !== '0') {
                    const date: Date = new Date(Number(data.substring(0, 4)), 0, 1);
                    
                    for (; date.valueOf() <= today.valueOf(); date.setFullYear(date.getFullYear() + 1)) {
                        const newOption: HTMLOptionElement = new Option(`${ date.getFullYear() }`, `${ date.getFullYear() }-01-01 00:00:00`);
                        
                        dateSelectorEl?.appendChild(newOption);
                        
                        runAfterSettingSelectorOptions();
                    }
                } else {
                    const date: Date = new Date();
                    const newOption: HTMLOptionElement = new Option(`${ date.getFullYear() }`, `${ date.getFullYear() }-01-01 00:00:00`);
                    
                    dateSelectorEl?.appendChild(newOption);
                    
                    runAfterSettingSelectorOptions();
                }
            });
            break;
    }
}

function runAfterSettingSelectorOptions(): void {
    const dateString: string | undefined = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    
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

function renewCardValue(): void {
    if (thisYearEmissionsEl) {
        setDataByPostHttpRequest('thisYearEmissions', `location=${ locationInfo.location }`, (data: string): void => {
            thisYearEmissionsEl.innerText = addCommaInNumber(Number(data)) + ' t';
        });
    }
    
    if (thisYearRemainingPermissibleEmissionsEl && expectedOverEmissionsEl) {
        setDataByPostHttpRequest('thisYearRemainingPermissibleEmissions', `location=${ locationInfo.location }`, (data: string): void => {
            if (Number(data) > 0) {
                thisYearRemainingPermissibleEmissionsEl.innerText = addCommaInNumber(Number(data)) + ' t';
            } else {
                thisYearRemainingPermissibleEmissionsEl.innerText = '0 t';
            }
            
            setDataByPostHttpRequest('thisYearPredictionEmissions', `location=${ locationInfo.location }`, (predictionData: string): void => {
                const permissibleEmissions: number = Number(data);
                const predictionEmissions: number = Number(predictionData);
                
                if (predictionEmissions - permissibleEmissions > 0) {
                    expectedOverEmissionsEl.innerText = addCommaInNumber(predictionEmissions - permissibleEmissions) + ' t';
                } else {
                    expectedOverEmissionsEl.innerText = '0 t';
                }
            });
        });
    }
}

function renewTodayEmissionChart(): void {
    if (todayTotalEmissionsEl) {
        setDataByPostHttpRequest('todayEmissions', `location=${ locationInfo.location }`, (data: string): void => {
            todayTotalEmissionsEl.innerText = addCommaInNumber(Number(data)) + ' t';
        });
    }
    
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByPostHttpRequest('todayComparedToThisMonthAverageEmissions', `location=${ locationInfo.location }`, (data: string): void => {
            if (data[0] === '-') {
                todayComparedToThisMonthAverageEl.innerText = Number(data.substring(1)).toFixed(1) + '%'
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/decrease_arrow.svg';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--increase');
                todayComparedToThisMonthAverageEl.parentElement?.classList.add('info-value--decrease');
            } else if (data[0] === '0') {
                todayComparedToThisMonthAverageEl.innerText = data + '%';
                todayComparedToThisMonthAverageArrowEl.src = '';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--increase');
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--decrease');
            } else {
                todayComparedToThisMonthAverageEl.innerText = Number(data).toFixed(1) + '%'
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/increase_arrow.svg';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--decrease');
                todayComparedToThisMonthAverageEl.parentElement?.classList.add('info-value--increase');
            }
        });
    }
}

function renewPredictionEmissionsChart(): void {
    if (thisYearTotalPredictionEmissionsEl) {
        setDataByPostHttpRequest('thisYearPredictionEmissions', `location=${ locationInfo.location }`, (data: string): void => {
            thisYearTotalPredictionEmissionsEl.innerText = addCommaInNumber(Number(data)) + ' t';
        });
    }
}

function renewContributionChart(): void {
    if (thisYearEmissionsOfLocation1El && thisYearEmissionsOfLocation2El && thisYearEmissionsOfLocation3El && contributionOfLocation1El && contributionOfLocation2El && contributionOfLocation3El) {
        setDataByPostHttpRequest('thisYearEmissions', `location=${ info.workplace1.location }`, (data1: string): void => {
            setDataByPostHttpRequest('thisYearEmissions', `location=${ info.workplace2.location }`, (data2: string): void => {
                setDataByPostHttpRequest('thisYearEmissions', `location=${ info.workplace3.location }`, (data3: string): void => {
                    const emissionsOfLocation1: number = Number(data1);
                    const emissionsOfLocation2: number = Number(data2);
                    const emissionsOfLocation3: number = Number(data3);
                    const sumOfEmissions: number = emissionsOfLocation1 + emissionsOfLocation2 + emissionsOfLocation3;
                    const contributionOfLocation1: number = emissionsOfLocation1 / sumOfEmissions * 100;
                    const contributionOfLocation2: number = emissionsOfLocation2 / sumOfEmissions * 100;
                    const contributionOfLocation3: number = emissionsOfLocation3 / sumOfEmissions * 100;
    
                    thisYearEmissionsOfLocation1El.innerText = addCommaInNumber(emissionsOfLocation1) + ' t';
                    thisYearEmissionsOfLocation2El.innerText = addCommaInNumber(emissionsOfLocation2) + ' t';
                    thisYearEmissionsOfLocation3El.innerText = addCommaInNumber(emissionsOfLocation3) + ' t';
    
                    contributionOfLocation1El.innerText = contributionOfLocation1.toFixed(1) + '%';
                    contributionOfLocation2El.innerText = contributionOfLocation2.toFixed(1) + '%';
                    contributionOfLocation3El.innerText = contributionOfLocation3.toFixed(1) + '%';
                });
            });
        });
    }
}

window.addEventListener('DOMContentLoaded', (): void => {
    if (todayEmissionsChartEl) {
        const today: Date = new Date();
        
        today.setHours(0, 0, 0);
        
        todayEmissionsChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ today.valueOf() }&to=now&theme=light&panelId=${ locationInfo.todayEmissionsPanelId }`;
    }
    
    if (predictionChartEl) {
        const today: Date = new Date();
        const nextYear: Date = new Date(today.getFullYear() + 1, today.getMonth(), 1, 0, 0, -1);
        
        today.setDate(-12);
        
        predictionChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ today.valueOf() }&to=${ nextYear.valueOf() }&theme=light&panelId=${ locationInfo.predictionEmissionsPanelId }`;
    }
    
    setSelectorOptions();
    
    renewTodayEmissionChart();
    renewPredictionEmissionsChart();
    renewCardValue();
    renewContributionChart();
});

yearlyMonthlySelectorEl?.addEventListener('change', (): void => {
    const selectedStr: string = yearlyMonthlySelectorEl?.options[yearlyMonthlySelectorEl?.selectedIndex].value;
    
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

dateSelectorEl?.addEventListener('change', runAfterSettingSelectorOptions);

setInterval(renewTodayEmissionChart, renewingPeriod);
setInterval(renewPredictionEmissionsChart, renewingPeriod);
setInterval(renewCardValue, renewingPeriod);
setInterval(renewContributionChart, renewingPeriod);