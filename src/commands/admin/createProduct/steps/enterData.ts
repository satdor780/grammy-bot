import { InlineKeyboard } from "grammy";
import { Product, ProductContent } from "../../../../models/index.js";
import { isAdmin } from "../../../../utils/isAdmin.js";
import { MyContext } from "../../../../types/index.js";

export const enterData = async (ctx: MyContext) => {
  if (!isAdmin(ctx)) return;
  if (ctx.session.step !== "enter_data") return;
  if (!ctx.message?.text) return;

  const lines = ctx.message.text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const productType = ctx.session.productType as "mail" | "full" | "custom" | undefined;

  if (!productType || !["mail", "full", "custom"].includes(productType)) {
    await ctx.reply("Ошибка: тип продукта не выбран. Начните заново.");
    ctx.session.step = undefined;
    ctx.session.productType = undefined;
    return;
  }

  const productId = ctx.session.currentProductId;

  if (!productId) {
    await ctx.reply(
      "❌ Нет выбранного продукта. Выберите или создайте продукт сначала.",
    );
    ctx.session.step = undefined;
    ctx.session.productType = undefined;
    return;
  }

  try {
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      throw new Error("Продукт с таким ID не найден. Выберите другой.");
    }

    let createdContent;

    if (productType === "mail") {
      if (lines.length === 0) {
        throw new Error("Нужно указать хотя бы email");
      }

      createdContent = await ProductContent.create({
        product: productId,
        type: "mail",
        data: {
          email: lines[0],
          firstName: lines[1] || undefined,
          lastName: lines[2] || undefined,
          age: lines[3] ? Number(lines[3]) : undefined,
        },
      });
    } else if (productType === "full") {
      if (lines.length < 2) {
        throw new Error("Нужно указать хотя бы ФИО и адрес");
      }

      createdContent = await ProductContent.create({
        product: productId,
        type: "full",
        data: {
          fullName: lines[0],
          address: lines[1],
          city: lines[2] || undefined,
          state: lines[3] || undefined,
          zipCode: lines[4] || undefined,
          creditScore: lines[5] ? Number(lines[5]) : undefined,
        },
      });
    } else if (productType === "custom") {
      if (lines.length === 0) {
        throw new Error("Нужно указать хотя бы контент");
      }

      createdContent = await ProductContent.create({
        product: productId,
        type: "custom",
        data: {
          content: lines[0],
          title: lines[1] || undefined,
          externalLink: lines[2] || undefined,
          notes: lines[3] || undefined,
        },
      });
    }

    if (!createdContent) {
      await ctx.reply("❌ Не удалось сохранить контент.");
      return;
    }

    const justCreatedType = productType;

    ctx.session.step = undefined;
    ctx.session.productType = undefined;
    // currentProductId оставляем — удобно для добавления следующих позиций

    const keyboard = new InlineKeyboard()
      .text("Добавить ещё", `addContent:${productId}`)
      .text("⬅️ К продукту", `editProduct:${productId}`)
      .row()
      .text("🏠 В меню", "toMenu");

    const typeLabels: Record<string, string> = {
      mail: "mail",
      full: "full",
      custom: "custom",
    };
    const successText = `✅ Добавлен ${typeLabels[justCreatedType] || justCreatedType} аккаунт\n\nID: ${createdContent._id}`;

    if (ctx.session.lastMessageId && ctx.chat?.id) {
      try {
        await ctx.api.editMessageText(
          ctx.chat.id,
          ctx.session.lastMessageId,
          successText,
          { reply_markup: keyboard },
        );
        ctx.session.lastMessageId = undefined;
        return;
      } catch {}
    }

    await ctx.reply(successText, { reply_markup: keyboard });
  } catch (err: any) {
    const keyboard = new InlineKeyboard()
      .text("⬅️ Назад", "createProduct")
      .text("🏠 В меню", "toMenu");

    let text = "❌ Ошибка при сохранении";

    if (err.message.includes("хотя бы")) {
      text = `❌ ${err.message}`;
    } else if (err.name === "ValidationError") {
      text = "❌ Неверный формат данных";
    } else {
      text = `❌ ${err.message || "Неизвестная ошибка"}`;
    }

    if (ctx.session.lastMessageId && ctx.chat?.id) {
      try {
        await ctx.api.editMessageText(
          ctx.chat.id,
          ctx.session.lastMessageId,
          text,
          { reply_markup: keyboard },
        );
        return;
      } catch {}
    }

    await ctx.reply(text, { reply_markup: keyboard });
  }
};
