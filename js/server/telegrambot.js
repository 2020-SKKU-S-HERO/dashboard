"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTelegramBot = void 0;
const TelegramBot = require("node-telegram-bot-api");
const db_control_1 = require("./db_control");
const token = '1326445934:AAEkUeXkWy5rrnF9H0B8lXjo1MitMYvOyT4';
const bot = new TelegramBot(token, { polling: true });
function addCommaInNumber(num) {
    const sign = num < 0 ? '-' : '';
    const numberStr = num.toFixed(0);
    let resultStr = '';
    const point = numberStr.length % 3;
    let pos = 0;
    while (pos < numberStr.length) {
        if (pos % 3 === point && pos !== 0) {
            resultStr += ',';
        }
        ``;
        resultStr += numberStr[pos];
        pos++;
    }
    return sign + resultStr;
}
function sendTelegramMessageTo(authority, message) {
    db_control_1.getTelegramId(authority, (telegramId) => {
        bot.sendMessage(telegramId, message);
    });
}
function alertEvent() {
    const INSPECTION_INTERVAL = 10000;
    let prePercentage = 0;
    let isFirst = true;
    setInterval(() => {
        db_control_1.getThisYearEmissions('', (emissions) => {
            db_control_1.getThisYearPermissibleEmissions((permissibleEmissions) => {
                const percentage = emissions / permissibleEmissions;
                let doAlert = false;
                while (percentage >= prePercentage + 0.1) {
                    doAlert = true;
                    prePercentage += 0.1;
                }
                if (doAlert && !isFirst) {
                    sendTelegramMessageTo('administrator', `올해 배출량이 허용 배출량의 ${(prePercentage * 100).toFixed(0)}%를 초과하였습니다.`);
                }
                isFirst = false;
            });
        });
    }, INSPECTION_INTERVAL);
}
function startTelegramBot() {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        db_control_1.insertTelegramId(chatId, () => {
            bot.sendMessage(chatId, `계정이 등록되었습니다. 앞으로 알림을 받을 수 있습니다. '/help'라고 입력해서 명령어에 대한 가이드를 받을 수 있습니다.`);
            console.log(`register new telegram id : ${chatId}`);
        }, () => {
            bot.sendMessage(chatId, '이미 등록된 계정입니다.');
        });
    });
    bot.onText(/\/end/, (msg) => {
        const chatId = msg.chat.id;
        db_control_1.deleteTelegramId(chatId, () => {
            bot.sendMessage(chatId, '등록을 해제하였습니다. 더 이상 알림을 받을 수 없습니다.');
        });
    });
    bot.onText(/\/status(\s?)(.*)/, (msg, match) => {
        if (match) {
            const chatId = msg.chat.id;
            const location = match[2];
            if (location === '' || location === '병점' || location === '수원' || location === '인천') {
                db_control_1.getThisYearEmissions(location, (emissions) => {
                    db_control_1.getThisYearPermissibleEmissions((permissibleEmissions) => {
                        let titleMessage;
                        if (location === '') {
                            titleMessage = '[종합 현황]';
                        }
                        else {
                            titleMessage = `[${location} 사업장 현황]`;
                        }
                        bot.sendMessage(chatId, `${titleMessage}\n` +
                            `올해 총 배출량 : ${addCommaInNumber(emissions)} t\n` +
                            `올해 남은 허용 배출량 : ${addCommaInNumber(permissibleEmissions - emissions)} t`);
                    });
                });
            }
            else {
                bot.sendMessage(chatId, '지역이 잘못되었습니다.');
            }
        }
    });
    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, '[carbonium_notify Help]\n' +
            '/start : 계정을 등록하고 알림을 받습니다.\n' +
            '/end : 등록을 해제하고 알림을 더 이상 받지 않습니다.\n' +
            '/status [location] : 현황을 출력합니다.\n' +
            '/help : 명령어에 대한 가이드를 봅니다.');
    });
    alertEvent();
}
exports.startTelegramBot = startTelegramBot;
//# sourceMappingURL=telegrambot.js.map