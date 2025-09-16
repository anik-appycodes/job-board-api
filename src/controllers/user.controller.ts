import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { sendResponse } from "../helpers/api.helper.js";
import { AppError } from "../middlewares/error.middleware.js";
import { userService } from "../services/user.service.js";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return sendResponse(res, 200, "Users fetched successfully", users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("User ID is required", 400);

  const user = await userService.getUserById(Number(id));
  if (!user) throw new AppError("User not found", 404);

  return sendResponse(res, 200, "User fetched successfully", user);
};

export const addUser = async (req: Request, res: Response) => {
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
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authUser = req?.user;

  if (!id) throw new AppError("User ID is required", 400);

  if (authUser && authUser.id !== Number(id)) {
    throw new AppError("You can only update your own profile", 403);
  }

  const { name, email, role, company_id } = req.body;

  if (!name && !email && !role && !company_id) {
    throw new AppError("At least one field is required to update", 400);
  }

  const updatedUser = await userService.updateUser(Number(id), {
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
    ...(company_id && { company: { connect: { id: company_id } } }),
  } as Prisma.UserUpdateInput);

  if (!updatedUser) throw new AppError("User not found", 404);

  return sendResponse(res, 200, "User updated successfully", updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authUser = req?.user;

  if (!id) throw new AppError("User ID is required", 400);

  if (authUser && authUser.id !== Number(id)) {
    throw new AppError("You can only delete your own profile", 403);
  }

  const deletedUser = await userService.deleteUser(Number(id));
  if (!deletedUser)
    throw new AppError("User not found or already deleted", 404);

  return sendResponse(res, 200, "User deleted successfully", deletedUser);
};
