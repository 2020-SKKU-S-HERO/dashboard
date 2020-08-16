const dateSelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('past-emission-chart-date-selector');
const pastEmissionChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('past-emission-chart-home');
const todayTotalEmissionsEl: HTMLElement | null = document.getElementById('today-total-emissions');

const renewingPeriod: number = 10000;

function setEmissionChartInterval(fromDateString: string, monthInterval: number, chartEl: HTMLIFrameElement): void {
    const fromDate: Date = new Date(fromDateString);
    const toDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthInterval, 1, 12, 0, -1);
    
    fromDate.setHours(-12);
    
    chartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=4`;
}

function renewValues(): void {
    const httpRequest: XMLHttpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = (): void => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (todayTotalEmissionsEl) {
                    const responseJson: any = JSON.parse(httpRequest.responseText);
                    
                    todayTotalEmissionsEl.innerText = responseJson['total_emissions'] + 't';
                }
            }
        }
    }
    httpRequest.open('GET', 'http://localhost:3000/emissions/home/todayEmissions');
    httpRequest.send(null);
}

dateSelectorEl?.addEventListener('change', (): void => {
    const dateString: string = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    
    setEmissionChartInterval(dateString, 1, pastEmissionChartEl);
});

window.addEventListener('DOMContentLoaded', (): void => {
    const dateString: string = dateSelectorEl?.options[0].value;
    
    setEmissionChartInterval(dateString, 1, pastEmissionChartEl);
    renewValues();
});

setInterval(renewValues, renewingPeriod);