import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { AppError } from "../middlewares/error.middleware.js";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import type { Prisma } from "@prisma/client";

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return sendResponse(res, 200, "Users fetched successfully", users);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("User ID is required", 400);

  const user = await userService.getUserById(Number(id));
  if (!user) throw new AppError("User not found", 404);

  return sendResponse(res, 200, "User fetched successfully", user);
});

export const addUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, role, company_id } = req.body;

  if (!name || !email || !role) {
    throw new AppError("Missing required fields", 400);
  }

  const newUser = await userService.createUser({
    name,
    email,
    role,
    company: company_id ? { connect: { id: company_id } } : undefined,
  } as Prisma.UserCreateInput);

  return sendResponse(res, 201, "User created successfully", newUser);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authUser = (req as any).user as { id: number };

  if (!id) throw new AppError("User ID is required", 400);

  if (authUser.id !== Number(id)) {
    throw new AppError("You can only update your own profile", 403);
  }

  const { name, email, role, company_id } = req.body;
  if (!name && !email && !role && !company_id) {
    throw new AppError("At least one field is required to update", 400);
  }

  const updatedUser = await userService.updateUser(Number(id), {
    name,
    email,
    role,
    company: company_id ? { connect: { id: company_id } } : undefined,
  } as Prisma.UserUpdateInput);

  if (!updatedUser) throw new AppError("User not found", 404);

  return sendResponse(res, 200, "User updated successfully", updatedUser);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authUser = (req as any).user as { id: number };

  if (!id) throw new AppError("User ID is required", 400);

  if (authUser.id !== Number(id)) {
    throw new AppError("You can only delete your own profile", 403);
  }

  const deletedUser = await userService.deleteUser(Number(id));
  if (!deletedUser)
    throw new AppError("User not found or already deleted", 404);

  return sendResponse(res, 200, "User deleted successfully", deletedUser);
});
