import { Router } from 'express'

import initRouter from './init.js'
import buyRouter from './buy.js'

const router = Router()

router.use(initRouter)
router.use(buyRouter)

export default router
