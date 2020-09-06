import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { getTelegramId, getThisYearEmissions, getThisYearPermissibleEmissions, insertTelegramId } from './db_control';

const token: string = '1326445934:AAEkUeXkWy5rrnF9H0B8lXjo1MitMYvOyT4';
const bot: TelegramBot = new TelegramBot(token, { polling: true });

function sendTelegramMessage(authority: string, message: string): void {
    getTelegramId(authority, (telegramId: number): void => {
        bot.sendMessage(telegramId, message);
    });
}

function alertEvent(): void {
    const INSPECTION_INTERVAL: number = 10000;
    
    let prePercentage: number = 0;
    let isFirst: boolean = true;
    
    setInterval((): void => {
        // 배출량이 허용 배출량의 10%의 배수가 될때마다 알림
        getThisYearEmissions('', (emissions: number): void => {
            getThisYearPermissibleEmissions('', (permissibleEmissions: number): void => {
                const percentage: number = emissions / permissibleEmissions;
                let doAlert: boolean = false;
    
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

export function startTelegramBot(): void {
    bot.onText(/\/start/, (msg: Message): void => {
        const chatId: number = msg.chat.id;
    
        insertTelegramId(chatId, (): void => {
            bot.sendMessage(chatId, '계정이 등록되었습니다. 앞으로 알림을 받으실 수 있습니다.');
            console.log(`register new telegram id : ${chatId}`);
        }, (): void => {
            bot.sendMessage(chatId, '이미 등록된 계정입니다.');
        });
    });
    
    alertEvent();
}