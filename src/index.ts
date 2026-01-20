import 'dotenv/config';
import {Bot, session} from 'grammy';
import { GrammyError, HttpError } from 'grammy';
import moongose from 'mongoose';
import {hydrate} from '@grammyjs/hydrate'
import {MyContext, MySession} from './types/index.js'
import {start} from "./commands/start/index.js";
import {usersCommand} from "./commands/admin/index.js";
import {products} from "./commands/products/index.js";
import {chooseType, createProduct, enterData} from "./commands/admin/createProduct/index.js";
import { support } from './commands/support/support.js';

const token = process.env.BOT_TOKEN
const mongoDbURL = process.env.MONGODB_URI;

if(!token) {
    throw new Error('BOT_TOKEN is not defined')
}

const bot = new Bot<MyContext>(token);
bot.use(hydrate());

bot.use(
    session({
        initial: (): MySession => ({}), // ← ВАЖНО
    })
)

// Ответ на команду /start
bot.command('start', start);

bot.callbackQuery('users', usersCommand);

bot.callbackQuery('toMenu', start);

bot.callbackQuery('products', products)

bot.callbackQuery('createProduct', createProduct)

bot.callbackQuery('support', support)

bot.callbackQuery(/^create_product:/, chooseType)
bot.on('message:text', enterData)

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