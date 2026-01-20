import {MyContext} from "../../types/index.js";

import {InlineKeyboard} from "grammy";
import {isAdmin} from "../../utils/isAdmin.js";
import {adminStart} from "../admin/start/index.js";
import {User} from "../../models/index.js";
import {Menu} from "@grammyjs/menu";

export const start = async (ctx: MyContext) => {
    // Answer callback query if this is from a callback
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
    }

    if(!ctx.from) {
        if (ctx.callbackQuery?.message) {
            await ctx.callbackQuery.message.editText('user is undefined');
        } else {
            await ctx.reply('user is undefined');
        }
        return
    }
    if(isAdmin(ctx)) return adminStart(ctx)

    try{
        const user = await User.findOne({telegramId: ctx.from.id});
        const keyboard = new InlineKeyboard()
            .webApp(
                '🛍 Продукты',
                'https://sardor-react-portfolio.netlify.app' // <-- твой mini-app
            )
            .text('🆘 Тех поддержка', 'support');
        
        // If called from callback query, edit the message
        if (ctx.callbackQuery?.message) {
            if(user) {
                return await ctx.callbackQuery.message.editText('вы уже зарегистрированы', {
                    reply_markup: keyboard
                })
            }
            const newUser = new User({
                telegramId: ctx.from.id,
                userName: ctx.from.username,
                firstName: ctx.from.first_name,
                balance: 0
            })
            await newUser.save();
            return await ctx.callbackQuery.message.editText('вы успешно зарегистрировались', {
                reply_markup: keyboard,
            })
        }
        
        // If called from command, send new message
        if(user) {
            return await ctx.reply('вы уже зарегистрированы', {
                reply_markup: keyboard
            })
        }
        const newUser = new User({
            telegramId: ctx.from.id,
            userName: ctx.from.username,
            firstName: ctx.from.first_name,
            balance: 0
        })
        await newUser.save();
        return await ctx.reply('вы успешно зарегистрировались', {
            reply_markup: keyboard,
        })
    }catch (error) {
        console.error('Error in start:', error);
    }
}