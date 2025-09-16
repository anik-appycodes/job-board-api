import type { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import prisma from "../configs/prisma.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);

    // Attach decoded user + prisma user to req
    const user = await prisma.user.findUnique({
      where: { email: decoded.email! },
      include: { role: true },
    });
    if (!user || !user.role) {
      return res
        .status(401)
        .json({ message: "User or role not found in database" });
    }

    req.user = {
      id: user.id,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      company_id: user.company_id,
    }; // attach prisma user

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
