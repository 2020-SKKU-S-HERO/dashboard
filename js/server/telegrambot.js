"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTelegramBot = void 0;
const TelegramBot = require("node-telegram-bot-api");
const db_control_1 = require("./db_control");
const token = '1326445934:AAEkUeXkWy5rrnF9H0B8lXjo1MitMYvOyT4';
const bot = new TelegramBot(token, { polling: true });
function sendTelegramMessage(authority, message) {
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
            db_control_1.getThisYearPermissibleEmissions('', (permissibleEmissions) => {
                const percentage = emissions / permissibleEmissions;
                let doAlert = false;
                while (percentage >= prePercentage + 0.1) {
                    doAlert = true;
                    prePercentage += 0.1;
                }
                if (doAlert && !isFirst) {
                    sendTelegramMessage('administrator', `올해 배출량이 허용 배출량의 ${(prePercentage * 100).toFixed(0)}%를 초과하였습니다.`);
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
            bot.sendMessage(chatId, '계정이 등록되었습니다. 앞으로 알림을 받으실 수 있습니다.');
            console.log(`register new telegram id : ${chatId}`);
        }, () => {
            bot.sendMessage(chatId, '이미 등록된 계정입니다.');
        });
    });
    alertEvent();
}
exports.startTelegramBot = startTelegramBot;
//# sourceMappingURL=telegrambot.js.map