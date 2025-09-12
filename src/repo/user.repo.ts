import type { Prisma } from "@prisma/client";
import prisma from "../configs/prisma.js";

async function getAll(
  query: Prisma.UserWhereInput = {},
  orderBy?: Prisma.UserOrderByWithRelationInput
) {
  return prisma.user.findMany({
    where: query,
    ...(orderBy ? { orderBy } : {}),
  });
}

async function getById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function create(user: Prisma.UserCreateInput) {
  return prisma.user.create({ data: user });
}

async function update(id: number, user: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data: user,
  });
}

async function remove(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}

export const userRepo = { getById, getAll, create, update, remove };
