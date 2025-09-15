import type { Prisma, User } from "@prisma/client";
import prisma from "../configs/prisma.js";

async function getByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async function create(user: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data: user });
}

export const authRepo = {
  getByEmail,
  create,
};
