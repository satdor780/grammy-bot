import {Document, Schema, model} from 'mongoose';

export interface IUser extends Document {
    telegramId: number
    userName: string
    firstName: string
    createdAt: Date
    balance: number
}

const userSchema = new Schema<IUser>({
    telegramId: {
        type: Number,
        required: [true, 'telegramId is required'],
    },
    userName: {type: String},
    firstName: {type: String},
    createdAt: {type: Date},
    balance: {type: Number, default: 0, required: true}
}, {timestamps: true})

export const User = model<IUser>('User', userSchema)