import { Router } from "express";
import { Product } from "../models/index.js";
import { ProductType } from "../models/products/product.types.js";

const router = Router();

interface CreateProductBody {
  type: ProductType;
  slug?: string;
  title: string;
  image: string;
  shortDescription: string;
  fullDescription?: string;
  basePrice: number;
  currency?: "RUB" | "USD" | "EUR";
  available: number;
  discounts?: { minQuantity: number; discount: number }[];
  contentTemplate?: string;
  isActive?: boolean;
}

router.post("/products", async (req, res) => {
  try {
    const body = req.body as CreateProductBody;

    const { type, title, image, shortDescription, basePrice, available } = body;

    if (
      !type ||
      !title ||
      !image ||
      !shortDescription ||
      basePrice == null ||
      available == null
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: type, title, image, shortDescription, basePrice, available",
      });
    }

    if (!Object.values(ProductType).includes(type)) {
      return res.status(400).json({ error: "Invalid product type" });
    }

    if (typeof basePrice !== "number" || basePrice < 0.01) {
      return res
        .status(400)
        .json({ error: "basePrice must be a number >= 0.01" });
    }

    const product = await Product.create({
      type,
      slug: body.slug?.trim() || undefined,
      title: body.title.trim(),
      image: body.image,
      shortDescription: body.shortDescription.trim(),
      fullDescription: body.fullDescription?.trim(),
      basePrice,
      currency: body.currency ?? "RUB",
      available,
      discounts: body.discounts ?? [],
      contentTemplate: body.contentTemplate || undefined,
      isActive: body.isActive ?? true,
    });

    return res.status(201).json({ success: true, product });
  } catch (err: unknown) {
    console.error(err);
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Product with this slug already exists" });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
