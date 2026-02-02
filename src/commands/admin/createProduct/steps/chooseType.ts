import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { MyContext } from "../../../../types/index.js";
import { isAdmin } from "../../../../utils/isAdmin.js";

// chooseType.ts — добавляем проверку
export const chooseType = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();

    if (!isAdmin(ctx)) return;

    const parts = ctx.callbackQuery.data.split(':');
    if (parts.length < 2) return;

    const type = parts[1] as 'mail' | 'full';

    if (!['mail', 'full'].includes(type)) {
        await ctx.answerCallbackQuery({ text: "Неизвестный тип", show_alert: true });
        return;
    }

    if (!ctx.callbackQuery.data.startsWith('create_product:') && !ctx.session.currentProductId) {
        await ctx.editMessageText(
            "❌ Сначала выберите или создайте продукт!\n\n" +
            "Вернитесь назад и выберите продукт, в который хотите добавить аккаунты.",
            {
                reply_markup: new InlineKeyboard()
                    .text('⬅️ К списку продуктов', 'create_product')
                    .text('🏠 В меню', 'toMenu')
            }
        );
        return;
    }

    ctx.session.productType = type;
    ctx.session.step = 'enter_data';

    const backKeyboard = new InlineKeyboard()
        .text('⬅️ Назад', 'createProduct')
        .text('🏠 В меню', 'toMenu');

    const messageId = ctx.callbackQuery.message?.message_id;

    if (type === 'mail') {
        await ctx.editMessageText(
            `Введите данные для 📩 Почты (по одной строке на поле):\n\n` +
            `email              \n` +
            `Имя                \n` +
            `Фамилия            \n` +
            `Возраст            `,
            { reply_markup: backKeyboard }
        );
    } else if (type === 'full') {
        await ctx.editMessageText(
            `Введите данные для 🧾 Фулки (по одной строке на поле):\n\n` +
            `ФИО                \n` +
            `Адрес              \n` +
            `Город              \n` +
            `Штат               \n` +
            `ZIP код            \n` +
            `Credit score       `,
            { reply_markup: backKeyboard }
        );
    }

    if (messageId) {
        ctx.session.lastMessageId = messageId;
    }
};