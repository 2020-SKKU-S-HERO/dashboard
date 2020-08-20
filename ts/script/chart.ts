const thisYearEmissionsEl: HTMLElement | null = document.getElementById('this-year-total-emissions');
const thisYearRemainingPermissibleEmissionsEl: HTMLElement | null = document.getElementById('this-year-remaining-permissible-emissions');

const todayEmissionsChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('today-emissions-chart');
const todayTotalEmissionsEl: HTMLElement | null = document.getElementById('today-total-emissions');
const todayComparedToThisMonthAverageEl: HTMLElement | null = document.getElementById('today-compared-to-this-month-average');
const todayComparedToThisMonthAverageArrowEl: HTMLImageElement | null = <HTMLImageElement>document.getElementById('today-compared-to-this-month-average-arrow');

const yearlyMonthlySelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('yearly-monthly-selector');
const dateSelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('past-emission-chart-date-selector');
const selectedMonthChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('selected-month-chart');
const selectedMonthTotalEmissions: HTMLElement | null = document.getElementById('selected-month-total-emissions');
const selectedMonthComparedToLastYearEl: HTMLElement | null = document.getElementById('selected-month-compared-to-last-year');
const selectedMonthComparedToLastYearArrowEl: HTMLImageElement | null = <HTMLImageElement>document.getElementById('selected-month-compared-to-last-year-arrow');

const isHome: HTMLElement | null = document.getElementById('emissions-home');
const isWorkplace1: HTMLElement | null = document.getElementById('emissions-workplace1');
const isWorkplace2: HTMLElement | null = document.getElementById('emissions-workplace2');
const isWorkplace3: HTMLElement | null = document.getElementById('emissions-workplace3');

const workplace1: string = 'location1';
const workplace2: string = 'location2';
const workplace3: string = 'location3';

const renewingPeriod: number = 10000;

enum Interval {
    DAILY,
    MONTHLY
}

let locationToPost: string;
let todayEmissionsPanelId: number;
let pastDailyEmissionsPanelId: number;
let pastMonthlyEmissionsPanelId: number;
let predictionEmissionsPanelId: number;

let selectedInterval: Interval = Interval.DAILY;

function addZeroInFront(num: number, width: number): string {
    const numberStr: string = num.toString();
    
    return numberStr.length >= width ? numberStr : new Array(width - numberStr.length + 1).join('0') + numberStr;
}

function setDataByGetHttpRequest(url: string, onGetData: (data: string) => void): void {
    const httpRequest: XMLHttpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = (): void => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                onGetData(httpRequest.responseText);
            }
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send(null);
}

function setDataByPostHttpRequest(url: string, dataToSend: string | null, onGetData: (data: string) => void): void {
    const httpRequest: XMLHttpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = (): void => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                onGetData(httpRequest.responseText);
            }
        }
    };
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(dataToSend + `&location=${ locationToPost }`);
}

function renewPastEmissionsChart(): void {
    const dateString: string | undefined = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    const year: string | undefined = dateString?.substring(0, 4);
    const month: string | undefined = dateString?.substring(5, 7);
    
    switch (selectedInterval) {
        case Interval.DAILY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('home/selectedMonthEmissions', `year=${ year }&month=${ month }`, (data: string): void => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('home/selectedMonthComparedToLastYear', `year=${ year }&month=${ month }`, (data: string): void => {
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = data.substring(1);
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--decrease');
                    } else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/increase_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--increase');
                    }
                });
            }
            break;
        
        case Interval.MONTHLY:
            if (selectedMonthTotalEmissions) {
                setDataByPostHttpRequest('home/selectedYearEmissions', `year=${ year }`, (data: string): void => {
                    selectedMonthTotalEmissions.innerText = data;
                });
            }
            
            if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
                setDataByPostHttpRequest('home/selectedYearComparedToLastYear', `year=${ year }`, (data: string): void => {
                    if (data === '-') {
                        selectedMonthComparedToLastYearEl.innerText = '-';
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else if (data[0] === '-') {
                        selectedMonthComparedToLastYearEl.innerText = data.substring(1);
                        selectedMonthComparedToLastYearArrowEl.src = 'images/svg/decrease_arrow.svg';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.add('info-value--decrease');
                    } else if (data[0] === '0') {
                        selectedMonthComparedToLastYearEl.innerText = data;
                        selectedMonthComparedToLastYearArrowEl.src = '';
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--increase');
                        selectedMonthComparedToLastYearEl.parentElement?.classList.remove('info-value--decrease');
                    } else {
                        selectedMonthComparedToLastYearEl.innerText = data;
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
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=${ pastDailyEmissionsPanelId }`;
            break;
        
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=${ pastMonthlyEmissionsPanelId }`;
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
            setDataByPostHttpRequest('home/theMostPastEmissionMonth', null, (data: string): void => {
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
            setDataByPostHttpRequest('home/theMostPastEmissionMonth', null, (data: string): void => {
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

function renewTodayEmissionChart(): void {
    if (todayTotalEmissionsEl) {
        setDataByPostHttpRequest('home/todayEmissions', null, (data: string): void => {
            todayTotalEmissionsEl.innerText = data;
        });
    }
    
    if (thisYearEmissionsEl) {
        setDataByPostHttpRequest('home/thisYearEmissions', null, (data: string): void => {
            thisYearEmissionsEl.innerText = data;
        });
    }
    
    if (thisYearRemainingPermissibleEmissionsEl) {
        setDataByPostHttpRequest('home/thisYearRemainingPermissibleEmissions', null, (data: string): void => {
            thisYearRemainingPermissibleEmissionsEl.innerText = data;
        });
    }
    
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByPostHttpRequest('home/todayComparedToThisMonthAverageEmissions', null, (data: string): void => {
            if (data[0] === '-') {
                todayComparedToThisMonthAverageEl.innerText = data.substring(1);
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/decrease_arrow.svg';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--increase');
                todayComparedToThisMonthAverageEl.parentElement?.classList.add('info-value--decrease');
            } else if (data[0] === '0') {
                todayComparedToThisMonthAverageEl.innerText = data;
                todayComparedToThisMonthAverageArrowEl.src = '';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--increase');
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--decrease');
            } else {
                todayComparedToThisMonthAverageEl.innerText = data;
                todayComparedToThisMonthAverageArrowEl.src = 'images/svg/increase_arrow.svg';
                todayComparedToThisMonthAverageEl.parentElement?.classList.remove('info-value--decrease');
                todayComparedToThisMonthAverageEl.parentElement?.classList.add('info-value--increase');
            }
        });
    }
}

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

window.addEventListener('DOMContentLoaded', (): void => {
    if (todayEmissionsChartEl) {
        const today: Date = new Date();
        
        today.setHours(0, 0, 0);
        
        todayEmissionsChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ today.valueOf() }&to=now&theme=light&panelId=${ todayEmissionsPanelId }`;
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
} else if (isWorkplace1) {
    locationToPost = workplace1;
    todayEmissionsPanelId = 8;
    pastDailyEmissionsPanelId = 12;
    pastMonthlyEmissionsPanelId = 13;
    predictionEmissionsPanelId = 0;
} else if (isWorkplace2) {
    locationToPost = workplace2;
    todayEmissionsPanelId = 9;
    pastDailyEmissionsPanelId = 16;
    pastMonthlyEmissionsPanelId = 17;
    predictionEmissionsPanelId = 0;
} else if (isWorkplace3) {
    locationToPost = workplace3;
    todayEmissionsPanelId = 10;
    pastDailyEmissionsPanelId = 18;
    pastMonthlyEmissionsPanelId = 19;
    predictionEmissionsPanelId = 0;
}

setInterval(renewTodayEmissionChart, renewingPeriod);