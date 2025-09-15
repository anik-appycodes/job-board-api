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
    });
    if (!user) {
      return res.status(401).json({ message: "User not found in database" });
    }

    (req as any).user = user; // attach prisma user

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// export async requireAuthorization(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authUser = (req as any).user;
//   const { id } = req.params;

//   if (!authUser) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   if (Number(id) !== authUser.id) {
//     return res.status(403).json({ message: "Forbidden" });
//   }

//   next();
// }
