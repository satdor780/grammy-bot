import {MyContext} from "../../types/index.js";

import {InlineKeyboard} from "grammy";
import {isAdmin} from "../../utils/isAdmin.js";
import {adminStart} from "../admin/start/index.js";
import {User} from "../../models/index.js";

export const start = async (ctx: MyContext) => {
    if(!ctx.from) {
        ctx.reply('user is undefined')
        return
    }
    if(isAdmin(ctx)) return adminStart(ctx)

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
}