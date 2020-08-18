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

function setDataByPostHttpRequest(url: string, dataToSend: string, onGetData: (data: string) => void): void {
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
    httpRequest.send(dataToSend);
}

function renewPastEmissionsChart(): void {
    const dateString: string | undefined = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    const year: string | undefined = dateString?.substring(0, 4);
    const month: string | undefined = dateString?.substring(5, 7);
    
    if (selectedMonthTotalEmissions) {
        setDataByPostHttpRequest('home/selectedMonthEmissions', `year=${year}&month=${month}`, (data: string): void => {
            selectedMonthTotalEmissions.innerText = data;
        });
    }
    
    if (selectedMonthComparedToLastYearEl && selectedMonthComparedToLastYearArrowEl) {
        setDataByPostHttpRequest('home/selectedMonthComparedToLastYear', `year=${year}&month=${month}`, (data: string): void => {
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
}

function setEmissionChartInterval(fromDateString: string, monthInterval: number, chartEl: HTMLIFrameElement): void {
    const fromDate: Date = new Date(fromDateString);
    let toDate: Date;
    
    switch (selectedInterval) {
        case Interval.DAILY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, 1, -8, 0, -1);
            fromDate.setHours(-4);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=4`;
            break;
    
        case Interval.MONTHLY:
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, -10, 0, 0, -1);
            fromDate.setDate(-12);
            chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${ fromDate.valueOf() }&to=${ toDate.valueOf() }&theme=light&panelId=6`;
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
            setDataByGetHttpRequest('home/theMostPastEmissionMonth', (data: string): void => {
                const date: Date = new Date(Number(data.substring(0, 4)), Number(data.substring(5)) - 1);
        
                for (; date.valueOf() <= today.valueOf(); date.setMonth(date.getMonth() + 1)) {
                    const newOption: HTMLOptionElement = new Option(`${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }`, `${ date.getFullYear() }-${ addZeroInFront(date.getMonth() + 1, 2) }-01 00:00:00`);
            
                    dateSelectorEl?.appendChild(newOption);
    
                    runAfterSettingSelectorOptions();
                }
            });
            break;
    
        case Interval.MONTHLY:
            setDataByGetHttpRequest('home/theMostPastEmissionMonth', (data: string): void => {
                const date: Date = new Date(Number(data.substring(0, 4)), 0, 1);
        
                for (; date.valueOf() <= today.valueOf(); date.setFullYear(date.getFullYear() + 1)) {
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
        setDataByGetHttpRequest('home/todayEmissions', (data: string): void => {
            todayTotalEmissionsEl.innerText = data;
        });
    }
    
    if (thisYearEmissionsEl) {
        setDataByGetHttpRequest('home/thisYearEmissions', (data: string): void => {
            thisYearEmissionsEl.innerText = data;
        });
    }
    
    if (thisYearRemainingPermissibleEmissionsEl) {
        setDataByGetHttpRequest('home/thisYearRemainingPermissibleEmissions', (data: string): void => {
            thisYearRemainingPermissibleEmissionsEl.innerText = data;
        });
    }
    
    if (todayComparedToThisMonthAverageEl && todayComparedToThisMonthAverageArrowEl) {
        setDataByGetHttpRequest('home/todayComparedToThisMonthAverageEmissions', (data: string): void => {
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
        
        todayEmissionsChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${today.valueOf()}&to=now&theme=light&panelId=2`;
    }
    
    setSelectorOptions();
    
    renewTodayEmissionChart();
});

setInterval(renewTodayEmissionChart, renewingPeriod);