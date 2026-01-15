
import {InlineKeyboard} from "grammy";
import {MyContext} from "../../../types/index.js";
import {isAdmin} from "../../../utils/isAdmin.js";


export const adminStart = async (ctx: MyContext) => {
    if(!isAdmin(ctx)) {
        ctx.reply('user is not admin')
        return
    }

    const keyboard = new InlineKeyboard().text(
        'Продукты', 'adminProducts'
    ).text('пользователи', 'users')
    ctx.reply('Добро пожаловать в админ панель!', {
        reply_markup: keyboard
    })
    return

}