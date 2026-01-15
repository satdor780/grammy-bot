import {MyContext} from "../../../types/index.js";
import {isAdmin} from "../../../utils/isAdmin.js";

import {CallbackQueryContext, InlineKeyboard} from "grammy";
import {User} from "../../../models/index.js";


export const usersCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();

    if (!isAdmin(ctx)) {
        await ctx.callbackQuery.message?.editText('⛔ Доступ только для администраторов');
        return;
    }

    const keyboard = new InlineKeyboard().text(
        'в меню', 'toMenu'
    )

    const users = await User.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    const totalUsers = await User.countDocuments();
    const shownUsers = users.length;

    if (users.length === 0) {
        await ctx.callbackQuery.message?.editText('Пользователей пока нет');
        return;
    }

    const userCount = `Пользователей: ${totalUsers} (показано ${shownUsers})`;

    const text = users
        .map(
            (user, index) =>
                `${index + 1}. ${user.firstName ?? 'Без имени'} ${
                    user.userName ? `(@${user.userName})` : ''
                }\n id: ${user.telegramId}\n Баланс: ${user.balance}`
        )
        .join('\n\n');

    await ctx.callbackQuery.message?.editText(`${userCount}\n\n${text}`, {
        reply_markup: keyboard
    });
}