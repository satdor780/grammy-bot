import { Router } from 'express'

import { verifyTelegram } from './verifyTelegram.js'
import { Product, User } from '../models/index.js'

const router = Router()

router.post('/init', async (req, res) => {
  const { initData } = req.body

  const tgUser = verifyTelegram(initData)
  if (!tgUser) {
    return res.status(401).json({ ok: false })
  }

  const user = await User.findOne({ telegramId: tgUser.id })
  const products = await Product.find()

  res.json({
    user: { balance: user?.balance ?? 0 },
    products
  })
})

export default router
