import {MyContext} from "../../../../types/index.js";
import {isAdmin} from "../../../../utils/isAdmin.js";
import {Product} from "../../../../models/index.js";

export const enterData = async (ctx: MyContext) => {
    if (!isAdmin(ctx)) return
    if (ctx.session.step !== 'enter_data') return
    if (!ctx.message?.text) return

    const lines = ctx.message.text.split('\n').map(l => l.trim())

    try {
        if (ctx.session.productType === 'mail') {
            if (lines.length !== 4) throw new Error('Неверный формат')

            await Product.create({
                type: 'mail',
                price: 100,
                data: {
                    mail: lines[0],
                    firstName: lines[1],
                    lastName: lines[2],
                    age: Number(lines[3]),
                },
            })
        }

        if (ctx.session.productType === 'full') {
            if (lines.length !== 6) throw new Error('Неверный формат')

            await Product.create({
                type: 'full',
                price: 500,
                data: {
                    fullName: lines[0],
                    address: lines[1],
                    city: lines[2],
                    state: lines[3],
                    zipCode: lines[4],
                    creditScore: Number(lines[5]),
                },
            })
        }

        ctx.session.step = undefined
        ctx.session.productType = undefined

        await ctx.reply('✅ Продукт успешно создан')

    } catch (e) {
        await ctx.reply('❌ Ошибка. Проверь формат данных.')
    }
}
