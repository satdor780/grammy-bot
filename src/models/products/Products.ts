import { Schema, model, Document, Types } from "mongoose";
import { ProductType, DiscountTier } from "./product.types.js";

export interface IProduct extends Document {
  type: ProductType;
  slug?: string; // для красивого URL (опционально)
  title: string;
  image: string; // url картинки
  shortDescription: string;
  fullDescription?: string; // подробное описание (можно markdown)
  basePrice: number;
  currency?: string; // 'RUB', 'USD' — по умолчанию RUB
  available: number; // -1 = бесконечно
  discounts: DiscountTier[];
  contentTemplate?: Types.ObjectId; // ссылка на шаблон контента (если много одинаковых)
  createdAt: Date;
  updatedAt: Date;
}

const discountTierSchema = new Schema<DiscountTier>(
  {
    minQuantity: { type: Number, required: true, min: 1 },
    discount: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    basePrice: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: "USDT", enum: ["USDT", "BTC"] },
    available: { type: Number, required: true, default: 0 }, // -1 = unlimited
    discounts: { type: [discountTierSchema], default: [] },
    contentTemplate: { type: Schema.Types.ObjectId, ref: "ProductContent" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

productSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Product = model<IProduct>("Product", productSchema);
