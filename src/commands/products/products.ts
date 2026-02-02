import {MyContext} from "../../types/index.js";

import {CallbackQueryContext, InlineKeyboard} from "grammy";
import {isAdmin} from "../../utils/isAdmin.js";
import {adminStart} from "../admin/start/index.js";
import {Product, User} from "../../models/index.js";

const MINIAPP_URI = process.env.MINIAPP_URI

export const products = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();
    if(!ctx.from) {
        await ctx.callbackQuery.message?.editText('user is undefined')
        return
    }
    if(isAdmin(ctx)) {
        const keyboard = new InlineKeyboard()
            .text('Добавить продукт', 'createProduct')
            .row()
            .webApp(
                '🛍 Добавить продукт (витрина)',
                MINIAPP_URI ?? ''
            )
            .row()
            .webApp(
                '🛍 Просмотр витрины',
                MINIAPP_URI ?? ''
            )
            .row()
            .text('⬅️ Назад', 'toMenu')
        const mailCount = await Product.countDocuments({ type: 'mail' })
        const fullCount = await Product.countDocuments({ type: 'full' })

        await ctx.callbackQuery.message?.editText(`в магазине доступно: \n\n${mailCount} — Mails,\n${fullCount} — Full info`,
            {reply_markup: keyboard} )
    }
}