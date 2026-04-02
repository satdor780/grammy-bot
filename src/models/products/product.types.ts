export enum ProductType {
  MAIL = "mail",
  FULL = "full",
  CUSTOM = "custom",
  // можно добавить позже: 'game_account', 'subscription', 'forecast' и т.д.
}

export interface DiscountTier {
  minQuantity: number;
  discount: number; // 0 → 1 (доля)
}

// ────────────────────────────────────────────────
// Конкретные типы данных для каждого вида продукта

export interface MailData {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  // любые другие поля, которые бывают у mail-аккаунтов
}

export interface FullData {
  fullName: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  creditScore?: number;
  // ssnLast4?: string;  // если нужно
}

export interface CustomData {
  content: string;
}

// ────────────────────────────────────────────────
// Discriminated union — основной тип для data

export type ProductContentData =
  | { type: ProductType.MAIL; data: MailData }
  | { type: ProductType.FULL; data: FullData }
  | { type: ProductType.CUSTOM; data: CustomData };
