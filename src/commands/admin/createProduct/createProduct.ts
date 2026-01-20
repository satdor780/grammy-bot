
import {CallbackQueryContext, InlineKeyboard} from "grammy";
import {MyContext} from "../../../types/index.js";
import {isAdmin} from "../../../utils/isAdmin.js";


export const createProduct = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();
    if(!ctx.from) {
        await ctx.callbackQuery.message?.editText('user is undefined')
        return
    }
    ctx.session.step = 'choose_type'
    if(isAdmin(ctx)) {
        const keyboard = new InlineKeyboard()
            .text('📩 Почта', 'create_product:mail')
            .row()
            .text('🧾 Фулка', 'create_product:full')
            .row()
            .text('⬅️ Назад', 'products')
            .text('🏠 В меню', 'toMenu')
        await ctx.callbackQuery.message?.editText('выберете тип продукта который хотите создать и следуйте дальнейшем инструкциям',
            {
                reply_markup: keyboard
            })
    }
}