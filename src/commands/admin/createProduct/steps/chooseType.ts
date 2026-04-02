import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { Product } from "../../../../models/index.js";
import { ProductType } from "../../../../models/products/product.types.js";
import { MyContext } from "../../../../types/index.js";
import { isAdmin } from "../../../../utils/isAdmin.js";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300";

// chooseType.ts — при create_product: создаём продукт и ставим currentProductId
export const chooseType = async (ctx: CallbackQueryContext<MyContext>) => {
  await ctx.answerCallbackQuery();

  if (!isAdmin(ctx)) return;

  const parts = ctx.callbackQuery.data.split(":");
  if (parts.length < 2) return;

  const type = parts[1] as "mail" | "full" | "custom";

  if (!["mail", "full", "custom"].includes(type)) {
    await ctx.answerCallbackQuery({
      text: "Неизвестный тип",
      show_alert: true,
    });
    return;
  }

  const isNewProduct = ctx.callbackQuery.data.startsWith("create_product:");

  // For custom type, show list of existing custom products instead of creating new one
  if (type === "custom" && isNewProduct) {
    try {
      const customProducts = await Product.find({ type: ProductType.CUSTOM });
      
      if (customProducts.length === 0) {
        await ctx.editMessageText(
          "❌ Нет доступных кастомных продуктов.\n\n" +
            "Сначала создайте кастомный продукт через витрину.",
          {
            reply_markup: new InlineKeyboard()
              .text("⬅️ Назад", "createProduct")
              .text("🏠 В меню", "toMenu"),
          },
        );
        return;
      }

      const keyboard = new InlineKeyboard();
      
      for (const product of customProducts) {
        const displayName = product.slug || product.title || product._id.toString();
        keyboard.text(`📦 ${displayName}`, `select_custom_product:${product._id.toString()}`);
        keyboard.row();
      }
      
      keyboard.text("⬅️ Назад", "createProduct").text("🏠 В меню", "toMenu");

      await ctx.editMessageText(
        "📦 Выберите кастомный продукт для добавления контента:",
        { reply_markup: keyboard },
      );
      return;
    } catch (err) {
      console.error("chooseType: fetch custom products failed", err);
      await ctx.editMessageText(
        "❌ Не удалось загрузить список продуктов. Попробуйте позже.",
        {
          reply_markup: new InlineKeyboard()
            .text("⬅️ Назад", "createProduct")
            .text("🏠 В меню", "toMenu"),
        },
      );
      return;
    }
  }

  if (!isNewProduct && !ctx.session.currentProductId) {
    await ctx.editMessageText(
      "❌ Сначала выберите или создайте продукт!\n\n" +
        "Вернитесь назад и выберите продукт, в который хотите добавить аккаунты.",
      {
        reply_markup: new InlineKeyboard()
          .text("⬅️ К списку продуктов", "create_product")
          .text("🏠 В меню", "toMenu"),
      },
    );
    return;
  }

  if (isNewProduct && !ctx.session.currentProductId) {
    try {
      let title: string;
      let productType: ProductType;
      
      if (type === "mail") {
        title = "Новый продукт (Почта)";
        productType = ProductType.MAIL;
      } else {
        title = "Новый продукт (Фулка)";
        productType = ProductType.FULL;
      }
      
      const product = await Product.create({
        type: productType,
        title,
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Заполните позже",
        basePrice: 0.01,
        available: 0,
      });
      ctx.session.currentProductId = product._id.toString();
    } catch (err) {
      console.error("chooseType: create product failed", err);
      await ctx.editMessageText(
        "❌ Не удалось создать продукт. Попробуйте позже.",
        {
          reply_markup: new InlineKeyboard()
            .text("⬅️ Назад", "createProduct")
            .text("🏠 В меню", "toMenu"),
        },
      );
      return;
    }
  }

  ctx.session.productType = type;
  ctx.session.step = "enter_data";

  const backKeyboard = new InlineKeyboard()
    .text("⬅️ Назад", "createProduct")
    .text("🏠 В меню", "toMenu");

  const messageId = ctx.callbackQuery.message?.message_id;

  if (type === "mail") {
    await ctx.editMessageText(
      `Введите данные для 📩 Почты (по одной строке на поле):\n\n` +
        `email              \n` +
        `Имя                \n` +
        `Фамилия            \n` +
        `Возраст            `,
      { reply_markup: backKeyboard },
    );
  } else if (type === "full") {
    await ctx.editMessageText(
      `Введите данные для 🧾 Фулки (по одной строке на поле):\n\n` +
        `ФИО                \n` +
        `Адрес              \n` +
        `Город              \n` +
        `Штат               \n` +
        `ZIP код            \n` +
        `Credit score       `,
      { reply_markup: backKeyboard },
    );
  }

  if (messageId) {
    ctx.session.lastMessageId = messageId;
  }
};
