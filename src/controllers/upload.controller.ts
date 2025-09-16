import type { Request, Response } from "express";
import { uploadUserImage } from "../services/upload.service.js";
import { AppError } from "../middlewares/error.middleware.js";

export async function uploadProfileImage(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) throw new AppError("Unauthorized", 401);

  if (!req.file) throw new AppError("No file provided", 400);

  try {
    const updatedUser = await uploadUserImage(
      user.id,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (err: any) {
    throw new AppError(err.message || "Upload failed", 500);
  }
}
