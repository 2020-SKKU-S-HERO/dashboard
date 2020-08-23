import { setDataByPostHttpRequest, locationInfo } from './common.js';

const gasCensorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('gas-censor-toggle-btn');
const flowCensorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('flow-censor-toggle-btn');
const tempCensorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('temp-censor-toggle-btn');

gasCensorToggleBtn.onchange = () => {
    if (gasCensorToggleBtn.checked) {
        console.log
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=gas&power=on`, (): void => {
        
        });
    } else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=gas&power=off`, (): void => {
    
        });
    }
};

flowCensorToggleBtn.onchange = () => {
    if (flowCensorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=flow&power=on`, (): void => {
    
        });
    } else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=flow&power=off`, (): void => {
    
        });
    }
};

tempCensorToggleBtn.onchange = () => {
    if (tempCensorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=temp&power=on`, (): void => {
    
        });
    } else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=temp&power=off`, (): void => {
    
        });
    }
};