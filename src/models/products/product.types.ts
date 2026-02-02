export enum ProductType {
    MAIL   = 'mail',
    FULL   = 'full',
    CUSTOM = 'custom',
    // можно добавить позже: 'game_account', 'subscription', 'forecast' и т.д.
  }
  
  export interface DiscountTier {
    minQuantity: number;
    discount: number;         // 0 → 1 (доля)
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
    title?: string;
    content: string;             // основной текст (markdown/plain/html)
    fileUrls?: string[];         // ссылки на доп. материалы
    externalLink?: string;       // Notion, Google Drive, видео и т.д.
    notes?: string;              // внутренние заметки (не показывать покупателю)
  }
  
  // ────────────────────────────────────────────────
  // Discriminated union — основной тип для data
  
  export type ProductContentData =
    | { type: ProductType.MAIL;   data: MailData }
    | { type: ProductType.FULL;   data: FullData }
    | { type: ProductType.CUSTOM; data: CustomData };