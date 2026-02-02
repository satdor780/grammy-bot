import { Schema, model, Document, Types } from 'mongoose';
import { ProductType, ProductContentData, MailData, FullData, CustomData } from './product.types.js';

// ────────────────────────────────────────────────
// Интерфейс документа
export interface IProductContent extends Document {
  product: Types.ObjectId;
  type: ProductType;
  data: MailData | FullData | CustomData;   // union вместо any
  createdAt: Date;
  updatedAt: Date;
}

// ────────────────────────────────────────────────
// Для удобства — type guard функции (можно вынести отдельно)
export function isMailContent(content: IProductContent): content is IProductContent & { type: ProductType.MAIL; data: MailData } {
  return content.type === ProductType.MAIL;
}

export function isFullContent(content: IProductContent): content is IProductContent & { type: ProductType.FULL; data: FullData } {
  return content.type === ProductType.FULL;
}

export function isCustomContent(content: IProductContent): content is IProductContent & { type: ProductType.CUSTOM; data: CustomData } {
  return content.type === ProductType.CUSTOM;
}

// ────────────────────────────────────────────────
// Схема
const productContentSchema = new Schema<IProductContent>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Очень полезный pre-save хук — проверяет соответствие type и структуры data
productContentSchema.pre('save', function (next) {
  const doc = this as IProductContent;

  try {
    if (doc.type === ProductType.MAIL) {
      // минимальная проверка (можно усилить с помощью zod / joi при создании)
      if (!doc.data || typeof doc.data.email !== 'string') {
        next(new Error('Mail content must have valid email'));
      }
    } else if (doc.type === ProductType.FULL) {
      if (!doc.data || typeof doc.data.fullName !== 'string' || typeof doc.data.address !== 'string') {
        next(new Error('Full content must have fullName and address'));
      }
    } else if (doc.type === ProductType.CUSTOM) {
      if (!doc.data || typeof doc.data.content !== 'string') {
        next(new Error('Custom content must have content field'));
      }
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

productContentSchema.index({ product: 1, type: 1 });

export const ProductContent = model<IProductContent>('ProductContent', productContentSchema);