import prisma from "../configs/prisma.js";

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

export function userHasPermission(user: any, action: string): boolean {
  if (!user?.role?.permissions) return false;
  return user.role.permissions.some(
    (rp: any) => rp.permission.action === action
  );
}

export function rbacMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // Derive API identifier (e.g., "POST /jobs")
      const apiIdentifier = `${req.method} ${req.route.path}`;

      // Get user permissions
      const dbUser = await getUserWithPermissions(user.id);
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      const hasPermission = dbUser.role.permissions.some(
        (rp: any) => rp.permission.api === apiIdentifier
      );

      if (!hasPermission) return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
