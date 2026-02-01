import {MyContext} from "../../types/index.js";

import {InlineKeyboard} from "grammy";
import {isAdmin} from "../../utils/isAdmin.js";
import {adminStart} from "../admin/start/index.js";
import {Product, User} from "../../models/index.js";
import {Menu} from "@grammyjs/menu";
import { products } from "../products/index.js";

const MINIAPP_URI = process.env.MINIAPP_URI

export const start = async (ctx: MyContext) => {
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
                MINIAPP_URI ?? ''
            )
            .text('🆘 Тех поддержка', 'support');

        console.log('products', Product.find())

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