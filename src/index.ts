import 'dotenv/config';
import { Bot, InlineKeyboard } from 'grammy';
import { GrammyError, HttpError } from 'grammy';
import moongose from 'mongoose';
import { User } from './models/User';
import {hydrate} from '@grammyjs/hydrate'
import {MyContext} from './types'

const token = process.env.BOT_TOKEN
const mongoDbURL = process.env.MONGODB_URI;

if(!token) {
    throw new Error('BOT_TOKEN is not defined')
}

const bot = new Bot<MyContext>(token);
bot.use(hydrate());

// Ответ на команду /start
bot.command('start', async (ctx) => {
    if(!ctx.from) {
        ctx.reply('user is undefined')
        return
    }
    try{
        const user = await User.findOne({telegramId: ctx.from.id});
        const keyboard = new InlineKeyboard().text(
            'Меню', 'menu'
        )
        if(user) {
            return ctx.reply('вы уже зарегистрированы', {
                reply_markup: keyboard
            })
        }
        const newUser = new User({
            telegramId: ctx.from.id,
            userName: ctx.from.username,
            firstName: ctx.from.first_name,
            balance: 0
        })
        newUser.save();
        return ctx.reply('вы успешно зарегистрировались', {
            reply_markup: keyboard
        })
    }catch (error) {
        console.error('Error in start:', error);
    }
});

// Ответ на любое сообщение
bot.on('message:text', (ctx) => {
    ctx.reply(ctx.message.text);
});

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