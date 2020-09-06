import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { getTelegramId, insertTelegramId } from './db_control';

const token: string = '1326445934:AAEkUeXkWy5rrnF9H0B8lXjo1MitMYvOyT4';
const bot: TelegramBot = new TelegramBot(token, { polling: true });

function sendTelegramMessage(authority: string, message: string): void {
    getTelegramId(authority, (telegramId: number): void => {
        bot.sendMessage(telegramId, message);
    });
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
    
    
}