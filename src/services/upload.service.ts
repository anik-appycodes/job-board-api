import cloudinary from "../configs/cloudinary.js";
import { firestore } from "../configs/firebase.js";
import type { User } from "@prisma/client";
import prisma from "../configs/prisma.js";

export async function uploadUserImage(
  userId: number,
  fileBuffer: Buffer,
  mimeType: string
): Promise<User> {
  try {
    const base64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: `users/${userId}`,
      resource_type: "image",
    });

    const imageUrl = uploadResult.secure_url;

    // Save URL in Firestore
    await firestore.collection("user_images").add({
      userId,
      imageUrl,
      fileName: uploadResult.public_id,
      uploadedAt: new Date(),
    });

    // Save URL in Prisma DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image_url: imageUrl },
    });

    return updatedUser;
  } catch (err) {
    console.error("Cloudinary or Firestore upload failed:", err);
    throw new Error("Failed to upload user image");
  }
}
