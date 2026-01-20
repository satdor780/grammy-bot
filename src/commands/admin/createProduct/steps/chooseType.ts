import {CallbackQueryContext, InlineKeyboard} from "grammy";
import {MyContext} from "../../../../types/index.js";
import {isAdmin} from "../../../../utils/isAdmin.js";

export const chooseType = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery()

    if (!isAdmin(ctx)) return

    const type = ctx.callbackQuery.data.split(':')[1] as 'mail' | 'full'

    ctx.session.productType = type
    ctx.session.step = 'enter_data'

    const backKeyboard = new InlineKeyboard()
        .text('⬅️ Назад', 'createProduct')
        .text('🏠 В меню', 'toMenu')

    // Store the message ID before editing so we can edit it later in enterData
    const messageId = ctx.callbackQuery.message?.message_id;
    
    if (type === 'mail') {
        await ctx.editMessageText(
            `Введите данные для 📩 Почты в формате:

email
Имя
Фамилия
Возраст`,
            {reply_markup: backKeyboard}
        )
    }

    if (type === 'full') {
        await ctx.editMessageText(
            `Введите данные для 🧾 Фулки в формате:

                    ФИО
                    Адрес
                    Город
                    Штат
                    ZIP
                    Credit score`,
            {reply_markup: backKeyboard}
        )
    }
    
    if (messageId) {
        ctx.session.lastMessageId = messageId;
    }
}
