import { Document, Schema, model  } from 'mongoose'
import {FullProductData, MailProductData, ProductType} from './product.types.js'

export interface IProduct extends Document {
    type: ProductType
    price: number
    data: MailProductData | FullProductData
    createdAt: Date
}

const productSchema = new Schema<IProduct>(
    {
        type: {
            type: String,
            enum: Object.values(ProductType),
            required: true,
        },
        price: {
            type: Number,
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
)

export const Product = model<IProduct>('Product', productSchema)
