import type { Request, Response, NextFunction } from "express";
import prisma from "../configs/prisma.js";
import { derivePermission } from "../helpers/api.helper.js";
import type { User } from "@prisma/client";

export async function getUserWithPermissions(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });
}

export function userHasPermission(user: User & any, action: string): boolean {
  if (!user?.role?.permissions) return false;
  return user.role.permissions.some(
    (rp: any) => rp.permission.action === action
  );
}

export function rbacMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // Derive permission like "job:create"
      const permissionStr = derivePermission(req);

      // Fetch user with permissions from DB
      const dbUser = await getUserWithPermissions(user.id);
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      const hasPermission = userHasPermission(dbUser, permissionStr);

      if (!hasPermission) return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err: any) {
      console.error("RBAC error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
