import {CallbackQueryContext} from "grammy";
import {MyContext} from "../../../../types/index.js";
import {isAdmin} from "../../../../utils/isAdmin.js";

export const chooseType = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery()

    if (!isAdmin(ctx)) return

    const type = ctx.callbackQuery.data.split(':')[1] as 'mail' | 'full'

    ctx.session.productType = type
    ctx.session.step = 'enter_data'

    if (type === 'mail') {
        await ctx.editMessageText(
            `Введите данные для 📩 Почты в формате:

email
Имя
Фамилия
Возраст`
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
Credit score`
        )
    }
}
