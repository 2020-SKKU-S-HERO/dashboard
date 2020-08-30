import { setDataByPostHttpRequest, locationInfo } from './common.js';

const mainMotorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('main-motor-toggle-btn');
const subMotorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('sub-motor-toggle-btn');

mainMotorToggleBtn.onchange = () => {
    if (mainMotorToggleBtn.checked) {
        console.log
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=on`, (): void => {
        
        });
    } else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=off`, (): void => {
    
        });
    }
};

subMotorToggleBtn.onchange = () => {
    if (subMotorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=sub&power=on`, (): void => {
    
        });
    } else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=sub&power=off`, (): void => {
    
        });
    }
};