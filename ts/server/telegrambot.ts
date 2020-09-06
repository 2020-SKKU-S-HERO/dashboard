import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import {
    deleteTelegramId,
    getTelegramId,
    getThisYearEmissions,
    getThisYearPermissibleEmissions,
    insertTelegramId
} from './db_control';

const token: string = '1326445934:AAEkUeXkWy5rrnF9H0B8lXjo1MitMYvOyT4';
const bot: TelegramBot = new TelegramBot(token, { polling: true });

function addCommaInNumber(num: number): string {
    const sign: string = num < 0 ? '-' : '';
    const numberStr: string = num.toFixed(0);
    let resultStr: string = '';
    const point: number = numberStr.length % 3;
    let pos: number = 0;
    
    while (pos < numberStr.length) {
        if (pos % 3 === point && pos !== 0) {
            resultStr += ',';
        }``
        
        resultStr += numberStr[pos];
        pos++;
    }
    
    return sign + resultStr;
}

function sendTelegramMessageTo(authority: string, message: string): void {
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
            getThisYearPermissibleEmissions((permissibleEmissions: number): void => {
                const percentage: number = emissions / permissibleEmissions;
                let doAlert: boolean = false;
    
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

export function startTelegramBot(): void {
    bot.onText(/\/start/, (msg: Message): void => {
        const chatId: number = msg.chat.id;
    
        insertTelegramId(chatId, (): void => {
            bot.sendMessage(chatId, `계정이 등록되었습니다. 앞으로 알림을 받을 수 있습니다. '/help'라고 입력해서 명령어에 대한 가이드를 받을 수 있습니다.`);
            console.log(`register new telegram id : ${chatId}`);
        }, (): void => {
            bot.sendMessage(chatId, '이미 등록된 계정입니다.');
        });
    });
    
    bot.onText(/\/end/, (msg: Message) => {
        const chatId: number = msg.chat.id;
        
        deleteTelegramId(chatId, (): void => {
            bot.sendMessage(chatId, '등록을 해제하였습니다. 더 이상 알림을 받을 수 없습니다.');
        });
    });
    
    bot.onText(/\/status(\s?)(.*)/, (msg: Message, match: RegExpExecArray | null): void => {
        if (match) {
            const chatId: number = msg.chat.id;
            const location: string = match[2];
    
            if (location === '' || location === '병점' || location === '수원' || location === '인천') {
                getThisYearEmissions(location, (emissions: number): void => {
                    getThisYearPermissibleEmissions((permissibleEmissions: number): void => {
                        let titleMessage: string;
            
                        if (location === '') {
                            titleMessage = '[종합 현황]';
                        } else {
                            titleMessage = `[${ location } 사업장 현황]`;
                        }
            
                        bot.sendMessage(chatId, `${ titleMessage }\n` +
                            `올해 총 배출량 : ${addCommaInNumber(emissions)} t\n` +
                            `올해 남은 허용 배출량 : ${addCommaInNumber(permissibleEmissions - emissions)} t`);
                    });
                });
            } else {
                bot.sendMessage(chatId, '지역이 잘못되었습니다.');
            }
        }
    });
    
    bot.onText(/\/help/, (msg: Message): void => {
        const chatId: number = msg.chat.id;
        
        bot.sendMessage(chatId,
            '[carbonium_notify Help]\n' +
            '/start : 계정을 등록하고 알림을 받습니다.\n' +
            '/end : 등록을 해제하고 알림을 더 이상 받지 않습니다.\n' +
            '/status [location] : 현황을 출력합니다.\n' +
            '/help : 명령어에 대한 가이드를 봅니다.');
    });
    
    alertEvent();
}