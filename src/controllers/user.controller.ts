import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { AppError } from "../middlewares/error.middleware.js";
import { catchAsync } from "../helpers/api.helper.js";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("User ID is required", 400);

  const user = await userService.getUserById(parseInt(id));
  if (!user) throw new AppError("User not found", 404);

  res.json({ success: true, data: user });
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
    company_id,
  });

  res.status(201).json({ success: true, data: newUser });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("User ID is required", 400);

  const { name, email, role, company_id } = req.body;

  if (!name && !email && !role && !company_id) {
    throw new AppError("At least one field is required to update", 400);
  }

  const updatedUser = await userService.updateUser(parseInt(id), {
    name,
    email,
    role,
    company_id,
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("User ID is required", 400);

  const deletedUser = await userService.deleteUser(parseInt(id));
  if (!deletedUser) {
    throw new AppError("User not found or already deleted", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});
