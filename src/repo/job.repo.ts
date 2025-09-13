import prisma from "../configs/prisma.js";
import type { Prisma } from "@prisma/client";

async function getAll(
  query: Prisma.JobWhereInput = {},
  orderBy?: Prisma.JobOrderByWithRelationInput,
  skip?: number,
  take?: number
) {
  return prisma.job.findMany({
    where: query,
    ...(orderBy ? { orderBy } : {}),
    ...(skip !== undefined ? { skip } : {}),
    ...(take !== undefined ? { take } : {}),
    include: { company: true, postedBy: true, applications: true },
  });
}

async function getById(id: number) {
  return prisma.job.findUnique({
    where: { id },
    include: { company: true, postedBy: true, applications: true },
  });
}

async function create(data: Prisma.JobCreateInput) {
  return prisma.job.create({ data });
}

async function update(id: number, data: Prisma.JobUpdateInput) {
  return prisma.job.update({
    where: { id },
    data,
  });
}

async function remove(id: number) {
  return prisma.job.delete({
    where: { id },
  });
}

export const jobRepo = { getAll, getById, create, update, remove };
