import { MyContext } from "../../types/index.js";

import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { isAdmin } from "../../utils/isAdmin.js";
import { adminStart } from "../admin/start/index.js";
import { Product, ProductContent, User } from "../../models/index.js";
import { ProductType } from "../../models/products/product.types.js";

const MINIAPP_URI = process.env.MINIAPP_URI;
const ADMINMINIAPP_URI = process.env.ADMINMINIAPP_URI;

export const products = async (ctx: CallbackQueryContext<MyContext>) => {
  await ctx.answerCallbackQuery();
  if (!ctx.from) {
    await ctx.callbackQuery.message?.editText("user is undefined");
    return;
  }
  if (isAdmin(ctx)) {
    const keyboard = new InlineKeyboard()
      .text("Добавить продукт", "createProduct")
      .row()
      .webApp("🛍 Добавить продукт (витрина)", ADMINMINIAPP_URI ?? "")
      .row()
      .webApp("🛍 Просмотр витрины", MINIAPP_URI ?? "")
      .row()
      .text("⬅️ Назад", "toMenu");
    const mailCount = await Product.countDocuments({ type: "mail" });
    const fullCount = await Product.countDocuments({ type: "full" });

    // Get custom products with their content counts
    const customProducts = await Product.find({ type: ProductType.CUSTOM });
    let customProductsText = "";
    
    if (customProducts.length > 0) {
      customProductsText = "\n\n📦 Кастомные продукты:\n";
      for (const product of customProducts) {
        const contentCount = await ProductContent.countDocuments({ product: product._id });
        const displayName = product.slug || product.title;
        customProductsText += `• ${displayName}: ${contentCount} шт.\n`;
      }
    }

    await ctx.callbackQuery.message?.editText(
      `в магазине доступно: \n\n${mailCount} — Mails,\n${fullCount} — Full info${customProductsText}`,
      { reply_markup: keyboard },
    );
  }
};
