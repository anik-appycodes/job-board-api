import type { Request, Response, NextFunction } from "express";

export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export function derivePermission(req: Request): string {
  const methodToAction: Record<string, string> = {
    POST: "create",
    GET: "read",
    PUT: "update",
    PATCH: "update",
    DELETE: "delete",
  };

  const action = methodToAction[req.method.toUpperCase()];
  if (!action) throw new Error(`Unsupported HTTP method: ${req.method}`);

  const parts = req.baseUrl.split("/").filter(Boolean);
  if (parts.length === 0)
    throw new Error("Cannot derive resource from request");

  let resource = parts[parts.length - 1];
  if (resource.endsWith("s")) resource = resource.slice(0, -1); // singular

  return `${resource}:${action}`;
}
