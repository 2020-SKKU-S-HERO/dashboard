// import { setDataByPostHttpRequest, locationInfo } from './common.js';
//
// const mainMotorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('main-motor-toggle-btn');
// const subMotorToggleBtn: HTMLInputElement = <HTMLInputElement>document.getElementById('sub-motor-toggle-btn');
//
//
// mainMotorToggleBtn.onchange = (): void => {
//     if (mainMotorToggleBtn.checked) {
//         setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=on`, (): void => {
//
//         });
//     } else {
//         setDataByPostHttpRequest('mqtt', `workplace=${locationInfo.location}&censor=main&power=off`, (): void => {
//
//         });
//     }
// };
//
// subMotorToggleBtn.onchange = (): void => {
//     if (subMotorToggleBtn.checked) {
//         setDataByPostHttpRequest('mqtt', `workplace=${ locationInfo.location }&censor=sub&power=on`, (): void => {
//
//         });
//     } else {
//         setDataByPostHttpRequest('mqtt', `workplace=${ locationInfo.location }&censor=sub&power=off`, (): void => {
//
//         });
//     }
// };