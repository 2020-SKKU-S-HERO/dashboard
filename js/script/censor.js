import { setDataByPostHttpRequest, locationInfo } from './common.js';
const gasCensorToggleBtn = document.getElementById('gas-censor-toggle-btn');
const flowCensorToggleBtn = document.getElementById('flow-censor-toggle-btn');
const tempCensorToggleBtn = document.getElementById('temp-censor-toggle-btn');
gasCensorToggleBtn.onchange = () => {
    if (gasCensorToggleBtn.checked) {
        console.log;
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=gas&power=on`, () => {
        });
    }
    else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=gas&power=off`, () => {
        });
    }
};
flowCensorToggleBtn.onchange = () => {
    if (flowCensorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=flow&power=on`, () => {
        });
    }
    else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=flow&power=off`, () => {
        });
    }
};
tempCensorToggleBtn.onchange = () => {
    if (tempCensorToggleBtn.checked) {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=temp&power=on`, () => {
        });
    }
    else {
        setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=temp&power=off`, () => {
        });
    }
};
//# sourceMappingURL=censor.js.map