import { Router } from "express";

import { Product, ProductContent, ProductType, User } from "../models/index.js";
import { validateInitData } from "../utils/index.js";

const router = Router();

router.post("/init", async (req, res) => {
  try {
    const { initData } = req.body;
    if (typeof initData !== "string") {
      return res.status(400).json({ error: "initData must be string" });
    }
    const validated = validateInitData(initData);
    if (!validated) {
      return res.status(401).json({ error: "Invalid initData signature" });
    }

    const { user } = validated;

    let dbUser = await User.findOne({ telegramId: user.id });

    const customProducts = await Product.find({ type: ProductType.CUSTOM });

    const warehouse = await Promise.all(
      customProducts.map(async (product) => ({
        productId: product._id.toString(),
        available: await ProductContent.countDocuments({
          product: product._id,
        }),
      })),
    );

    res.json({
      success: true,
      user: dbUser,
      userBalance: dbUser?.balance,
      warehouse,
      products: await Product.find().limit(20),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
