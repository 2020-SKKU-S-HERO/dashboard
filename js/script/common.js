const isHome = document.getElementById('emissions-home');
const isWorkplace1 = document.getElementById('emissions-workplace1');
const isWorkplace2 = document.getElementById('emissions-workplace2');
const isWorkplace3 = document.getElementById('emissions-workplace3');
export const gcpInfo = {
    ip: '34.64.84.89'
};
export const info = {
    home: {
        location: '',
        todayEmissionsPanelId: 2,
        pastDailyEmissionsPanelId: 4,
        pastMonthlyEmissionsPanelId: 6,
        predictionEmissionsPanelId: 22
    },
    workplace1: {
        location: '병점',
        cityName: 'hwaseong',
        todayEmissionsPanelId: 8,
        pastDailyEmissionsPanelId: 12,
        pastMonthlyEmissionsPanelId: 13,
        predictionEmissionsPanelId: 29,
        resourcePanelId: 2
    },
    workplace2: {
        location: '수원',
        cityName: 'suwon',
        todayEmissionsPanelId: 9,
        pastDailyEmissionsPanelId: 16,
        pastMonthlyEmissionsPanelId: 17,
        predictionEmissionsPanelId: 30,
        resourcePanelId: 3
    },
    workplace3: {
        location: '인천',
        cityName: 'incheon',
        todayEmissionsPanelId: 10,
        pastDailyEmissionsPanelId: 18,
        pastMonthlyEmissionsPanelId: 19,
        predictionEmissionsPanelId: 31,
        resourcePanelId: 4
    }
};
export let locationInfo;
export function setDataByGetHttpRequest(url, onGetData) {
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
export function setDataByPostHttpRequest(url, dataToSend, onGetData) {
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
    httpRequest.send(dataToSend);
}
if (isHome) {
    locationInfo = info.home;
}
else if (isWorkplace1) {
    locationInfo = info.workplace1;
}
else if (isWorkplace2) {
    locationInfo = info.workplace2;
}
else if (isWorkplace3) {
    locationInfo = info.workplace3;
}
//# sourceMappingURL=common.js.map