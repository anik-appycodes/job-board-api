import type { Application, Prisma } from "@prisma/client";
import { applicationRepo } from "../repo/application.repo.js";

async function getAllApplications(
  query: Prisma.ApplicationWhereInput = {},
  orderBy?: Prisma.ApplicationOrderByWithRelationInput
): Promise<Application[]> {
  return applicationRepo.getAll(query, orderBy);
}

async function getApplicationById(id: number): Promise<Application | null> {
  return applicationRepo.getById(id);
}

async function createApplication(
  data: Prisma.ApplicationCreateInput
): Promise<Application> {
  return applicationRepo.create(data);
}

async function updateApplication(
  id: number,
  data: Prisma.ApplicationUpdateInput
): Promise<Application> {
  return applicationRepo.update(id, data);
}

async function deleteApplication(id: number): Promise<Application> {
  return applicationRepo.remove(id);
}

export const applicationService = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
