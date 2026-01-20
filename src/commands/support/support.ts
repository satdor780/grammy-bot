import { InlineKeyboard } from "grammy";
import {MyContext} from "../../types/index.js";

export const support = async (ctx: MyContext) => {
    if (!ctx.callbackQuery) return;
    await ctx.answerCallbackQuery();

    const keyboard = new InlineKeyboard()
        .text('🏠 В меню', 'toMenu')

    await ctx.callbackQuery.message?.editText('по всем вопросам обращайтесь в нашу к @DRKSHDW110', {
        reply_markup: keyboard
    });
    
}