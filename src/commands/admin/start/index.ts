
import {InlineKeyboard} from "grammy";
import {MyContext} from "../../../types/index.js";
import {isAdmin} from "../../../utils/isAdmin.js";


export const adminStart = async (ctx: MyContext) => {
    // Answer callback query if this is from a callback
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
    }

    if(!isAdmin(ctx)) {
        if (ctx.callbackQuery?.message) {
            await ctx.callbackQuery.message.editText('user is not admin');
        } else {
            await ctx.reply('user is not admin');
        }
        return
    }

    const keyboard = new InlineKeyboard().text(
        'Продукты', 'products'
    ).text('пользователи', 'users')
    
    // If called from callback query, edit the message
    if (ctx.callbackQuery?.message) {
        await ctx.callbackQuery.message.editText('Добро пожаловать в админ панель!', {
            reply_markup: keyboard
        })
    } else {
        await ctx.reply('Добро пожаловать в админ панель!', {
            reply_markup: keyboard
        })
    }
    return

}