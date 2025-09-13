import prisma from "../configs/prisma.js";
import type { Prisma } from "@prisma/client";

async function getAll(
  query: Prisma.CompanyWhereInput = {},
  orderBy?: Prisma.CompanyOrderByWithRelationInput
) {
  return prisma.company.findMany({
    where: query,
    ...(orderBy ? { orderBy } : {}),
    include: { users: true, jobs: true },
  });
}

async function getById(id: number) {
  return prisma.company.findUnique({
    where: { id },
    include: { users: true, jobs: true },
  });
}

async function create(data: Prisma.CompanyCreateInput) {
  return prisma.company.create({ data });
}

async function update(id: number, data: Prisma.CompanyUpdateInput) {
  return prisma.company.update({
    where: { id },
    data,
  });
}

async function remove(id: number) {
  return prisma.company.delete({
    where: { id },
  });
}

export const companyRepo = { getAll, getById, create, update, remove };
