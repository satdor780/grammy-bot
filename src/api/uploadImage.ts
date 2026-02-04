import path from "path";
import { randomUUID } from "crypto";
import { Request } from "express";
import { Router } from "express";
import multer from "multer";
import { validateInitData } from "../utils/validateInitData.js";
import { isAdminByUserId } from "../utils/isAdmin.js";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, png, gif, webp) are allowed"));
    }
  },
});

router.post(
  "/upload-image",
  (req, res, next) => {
    upload.single("image")(req, res, (err: unknown) => {
      if (err) {
        const message =
          err instanceof Error ? err.message : "File upload failed";
        const isLimit =
          err &&
          typeof err === "object" &&
          "code" in err &&
          err.code === "LIMIT_FILE_SIZE";
        return res
          .status(400)
          .json({ error: isLimit ? "File too large (max 10 MB)" : message });
      }
      next();
    });
  },
  (req: Request, res) => {
    try {
      const initData = req.body?.initData;
      if (typeof initData !== "string") {
        return res.status(400).json({ error: "initData is required" });
      }
      const validated = validateInitData(initData);
      if (!validated) {
        return res.status(401).json({ error: "Invalid initData signature" });
      }
      if (!isAdminByUserId(validated.user.id)) {
        return res
          .status(403)
          .json({ error: "Forbidden: admin access required" });
      }

      const file = (req as Request & { file?: Express.Multer.File }).file;
      if (!file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const baseUrl = process.env.BASE_URL || "";
      const link = `${baseUrl}/api/uploads/${file.filename}`;

      return res.status(201).json({
        success: true,
        url: link,
        links: [link],
      });
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
