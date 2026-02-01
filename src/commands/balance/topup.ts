

import {MyContext} from "../../types/index.js";

import {InlineKeyboard} from "grammy";
import {isAdmin} from "../../utils/isAdmin.js";
import {adminStart} from "../admin/start/index.js";
import {Product, User} from "../../models/index.js";
import {Menu} from "@grammyjs/menu";
import { products } from "../products/index.js";


export const topup = async (ctx: MyContext) => {
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
    }


    if (!ctx.from) {
        if (ctx.callbackQuery?.message) {
            await ctx.callbackQuery.message.editText('user is undefined');
        } else {
            await ctx.reply('user is undefined');
        }
        return
    }

    const keyboard = new InlineKeyboard()
    .row()
    .text('⬅️ Назад', 'toMenu')
    
    const user = await User.findOne({telegramId: ctx.from.id});
    if (user) {
        user.balance += 100;
        await user.save();
        await ctx.callbackQuery?.message?.editText('Баланс пополнен на 100. Ваш текущий баланс: ' + user.balance + '₽', {
            reply_markup: keyboard
        });
        return
    }
    
    
}