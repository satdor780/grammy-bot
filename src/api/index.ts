import { Router } from 'express'

import initRouter from './init.js'
import buyRouter from './buy.js'

const router = Router()

// каждый роут уже знает свой путь
router.use(initRouter)
router.use(buyRouter)

export default router
