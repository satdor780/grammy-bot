import { Router } from "express";

import initRouter from "./init.js";
import buyRouter from "./buy.js";
import createProductRouter from "./createProduct.js";
import uploadImageRouter from "./uploadImage.js";

const router = Router();

router.use(initRouter);
router.use(buyRouter);
router.use(createProductRouter);
router.use(uploadImageRouter);

export default router;
