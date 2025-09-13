import prisma from "../configs/prisma.js";
import type { Prisma } from "@prisma/client";

async function getAll(
  query: Prisma.ApplicationWhereInput = {},
  orderBy?: Prisma.ApplicationOrderByWithRelationInput
) {
  return prisma.application.findMany({
    where: query,
    ...(orderBy ? { orderBy } : {}),
    include: {
      job: true,
      candidate: true,
    },
  });
}

async function getById(id: number) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
      candidate: true,
    },
  });
}

async function create(data: Prisma.ApplicationCreateInput) {
  return prisma.application.create({ data });
}

async function update(id: number, data: Prisma.ApplicationUpdateInput) {
  return prisma.application.update({
    where: { id },
    data,
  });
}

async function remove(id: number) {
  return prisma.application.delete({
    where: { id },
  });
}

export const applicationRepo = { getAll, getById, create, update, remove };
