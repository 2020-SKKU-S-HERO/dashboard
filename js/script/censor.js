import { setDataByPostHttpRequest, locationInfo } from './common.js';
const mainMotorToggleBtn = document.getElementById('main-motor-toggle-btn');
const subMotorToggleBtn = document.getElementById('sub-motor-toggle-btn');
mainMotorToggleBtn.onchange = () => {
    if (mainMotorToggleBtn.checked) {
        console.log;
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=on`, () => {
        });
    }
    else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=off`, () => {
        });
    }
};
subMotorToggleBtn.onchange = () => {
    if (subMotorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=sub&power=on`, () => {
        });
    }
    else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=sub&power=off`, () => {
        });
    }
};
//# sourceMappingURL=censor.js.map