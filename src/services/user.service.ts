import { userRepo } from "../repo/user.repo.js";
import type { User, Prisma } from "@prisma/client";

async function getAllUsers(): Promise<User[]> {
  return userRepo.getAll();
}

async function getUserById(id: number): Promise<User | null> {
  return userRepo.getById(id);
}

async function createUser(user: Prisma.UserCreateInput): Promise<User> {
  return userRepo.create(user);
}

async function updateUser(
  id: number,
  user: Prisma.UserUpdateInput
): Promise<User | null> {
  return userRepo.update(id, user);
}

async function deleteUser(id: number): Promise<User | null> {
  return userRepo.remove(id);
}

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
