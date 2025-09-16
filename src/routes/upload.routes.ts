import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { catchAsync } from "../helpers/api.helper.js";
import { uploadProfileImage } from "../controllers/upload.controller.js";

const router = Router();
const upload = multer();

router.use(requireAuth);

router.post("/profile", upload.single("image"), catchAsync(uploadProfileImage));

export default router;
