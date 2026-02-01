import { Router } from 'express'

import { verifyTelegram } from './verifyTelegram.js'
import { Product, User } from '../models/index.js'

const router = Router()

router.post('/init', async (req, res) => {
  try {
    const { initData } = req.body

    // Проверяем Telegram
    const tgUser = verifyTelegram(initData)
    if (!tgUser) {
      return res.status(401).json({
        ok: false,
        error: 'Telegram verification failed',
      })
    }

    // Получаем пользователя
    const user = await User.findOne({ telegramId: tgUser.id })

    // Получаем продукты
    const products = await Product.find()

    // Отправляем нормальный ответ
    return res.json({
      ok: true,
      user: { balance: user?.balance ?? 0 },
      products,
    })
  } catch (err) {
    console.error('Init error:', err)

    // Отправляем ошибку на фронт
    return res.status(500).json({
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown server error',
    })
  }
})

export default router