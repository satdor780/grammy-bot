export enum ProductType {
    MAIL = 'mail',
    FULL = 'full'
}

export interface MailProductData {
    mail: string
    firstName: string
    lastName: string
    age: number
}

export interface FullProductData {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    creditScore: number
}