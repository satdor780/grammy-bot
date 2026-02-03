import { Router } from "express";

import initRouter from "./init.js";
import buyRouter from "./buy.js";
import createProductRouter from "./createProduct.js";

const router = Router();

router.use(initRouter);
router.use(buyRouter);
router.use(createProductRouter);

export default router;
