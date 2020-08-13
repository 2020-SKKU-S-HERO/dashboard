const dateSelectorEl: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('past-emission-chart-date-selector');
const pastEmissionChartEl: HTMLIFrameElement | null = <HTMLIFrameElement>document.getElementById('past-emission-chart-home');

dateSelectorEl?.addEventListener('change', (): void => {
    const dateString = dateSelectorEl?.options[dateSelectorEl?.selectedIndex].value;
    const fromDate: Date = new Date(dateString);
    const toDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1, 0, 0, -1);
    
    console.log(fromDate);
    console.log(toDate);
    
    pastEmissionChartEl.src = `http://34.64.238.233:3000/d-solo/i7n74InMk/emissions?orgId=1&refresh=5s&from=${fromDate.valueOf()}&to=${toDate.valueOf()}&theme=light&panelId=2`;
});