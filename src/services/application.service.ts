import type { Application, Prisma } from "@prisma/client";
import { applicationRepo } from "../repo/application.repo.js";

export function getAllApplications(
  query: Prisma.ApplicationWhereInput = {},
  orderBy?: Prisma.ApplicationOrderByWithRelationInput
): Promise<Application[]> {
  return applicationRepo.getAll(query, orderBy);
}

export function getApplicationById(id: number): Promise<Application | null> {
  return applicationRepo.getById(id);
}

export function createApplication(
  data: Prisma.ApplicationCreateInput
): Promise<Application> {
  return applicationRepo.create(data);
}

export function updateApplication(
  id: number,
  data: Prisma.ApplicationUpdateInput
): Promise<Application> {
  return applicationRepo.update(id, data);
}

export function deleteApplication(id: number): Promise<Application> {
  return applicationRepo.remove(id);
}
