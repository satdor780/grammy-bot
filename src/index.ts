import 'dotenv/config';
import { Bot } from 'grammy';
import { GrammyError, HttpError } from 'grammy';
import moongose from 'mongoose';
import {hydrate} from '@grammyjs/hydrate'
import {MyContext} from './types/index.js'
import {start} from "./commands/start/index.js";
import {usersCommand} from "./commands/admin/index.js";

const token = process.env.BOT_TOKEN
const mongoDbURL = process.env.MONGODB_URI;

if(!token) {
    throw new Error('BOT_TOKEN is not defined')
}

const bot = new Bot<MyContext>(token);
bot.use(hydrate());

// Ответ на команду /start
bot.command('start', start);

// Ответ на любое сообщение
bot.on('message:text', (ctx) => {
    ctx.reply(ctx.message.text);
});

bot.callbackQuery('users', usersCommand);

bot.callbackQuery('toMenu', start);

// Обработка ошибок согласно документации
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {console.error('Unknown error:', e);
    }
});

// Функция запуска бота
async function startBot() {
    if(!mongoDbURL) {
        throw new Error('MONGODB_URL is not defined')
    }
    try {
        await moongose.connect(mongoDbURL);
        bot.start();
        console.log('moongose db Bot started');
    } catch (error) {
        console.error('Error in startBot:', error);
    }
}

startBot();