import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user;

    if (!user || user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
}
