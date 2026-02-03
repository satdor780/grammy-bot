import { Router } from "express";

import { Product, User } from "../models/index.js";
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

    res.json({
      success: true,
      user: dbUser,
      products: await Product.find().limit(20),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
