import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { Product } from "../../../../models/index.js";
import { ProductType } from "../../../../models/products/product.types.js";
import { MyContext } from "../../../../types/index.js";
import { isAdmin } from "../../../../utils/isAdmin.js";

// selectCustomProduct.ts — handles selection of a custom product for adding content
export const selectCustomProduct = async (ctx: CallbackQueryContext<MyContext>) => {
  await ctx.answerCallbackQuery();

  if (!isAdmin(ctx)) return;

  const parts = ctx.callbackQuery.data.split(":");
  if (parts.length < 2) return;

  const productId = parts[1];

  try {
    const product = await Product.findById(productId);

    if (!product) {
      await ctx.editMessageText(
        "❌ Продукт не найден. Возможно, он был удалён.",
        {
          reply_markup: new InlineKeyboard()
            .text("⬅️ Назад", "create_product:custom")
            .text("🏠 В меню", "toMenu"),
        },
      );
      return;
    }

    if (product.type !== ProductType.CUSTOM) {
      await ctx.editMessageText(
        "❌ Этот продукт не является кастомным.",
        {
          reply_markup: new InlineKeyboard()
            .text("⬅️ Назад", "create_product:custom")
            .text("🏠 В меню", "toMenu"),
        },
      );
      return;
    }

    // Set session data for the selected product
    ctx.session.currentProductId = productId;
    ctx.session.productType = "custom";
    ctx.session.step = "enter_data";

    const backKeyboard = new InlineKeyboard()
      .text("⬅️ Назад", "create_product:custom")
      .text("🏠 В меню", "toMenu");

    const messageId = ctx.callbackQuery.message?.message_id;

    const displayName = product.slug || product.title;

    await ctx.editMessageText(
      `📦 Продукт: ${displayName}\n\n` +
        `Введите данные для кастомного контента (по одной строке на поле):\n\n` +
        `Контент (обязательно)     \n` +
        `Заголовок (опционально)   \n` +
        `Внешняя ссылка (опционально)\n` +
        `Заметки (опционально)     `,
      { reply_markup: backKeyboard },
    );

    if (messageId) {
      ctx.session.lastMessageId = messageId;
    }
  } catch (err) {
    console.error("selectCustomProduct: failed", err);
    await ctx.editMessageText(
      "❌ Произошла ошибка. Попробуйте позже.",
      {
        reply_markup: new InlineKeyboard()
          .text("⬅️ Назад", "create_product:custom")
          .text("🏠 В меню", "toMenu"),
      },
    );
  }
};
