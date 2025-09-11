import { userRepo } from "../repo/user.repo.js";
import type { NewUserInput, User } from "../types/models/user.model.js";

async function getAllUsers(): Promise<User[]> {
  const result = await userRepo.getAll();
  return result.rows;
}

async function getUserById(id: number): Promise<User | null> {
  const result = await userRepo.getById(id);
  return result.rows[0] ?? null;
}

async function createUser(user: NewUserInput): Promise<User> {
  const result = await userRepo.create(user as User);
  return result.rows[0] as User;
}

async function updateUser(
  id: number,
  user: Partial<User>
): Promise<User | null> {
  const result = await userRepo.update(id, user);
  return result.rows[0] ?? null;
}

async function deleteUser(id: number): Promise<User | null> {
  const result = await userRepo.remove(id);
  return result.rows[0] ?? null;
}
export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
