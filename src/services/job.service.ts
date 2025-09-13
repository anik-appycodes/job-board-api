import type { Job, Prisma } from "@prisma/client";
import { jobRepo } from "../repo/job.repo.js";

export function getAllJobs(
  query: Prisma.JobWhereInput = {},
  orderBy?: Prisma.JobOrderByWithRelationInput,
  skip?: number,
  take?: number
): Promise<Job[]> {
  return jobRepo.getAll(query, orderBy, skip, take);
}

export function getJobById(id: number): Promise<Job | null> {
  return jobRepo.getById(id);
}

export function createJob(data: Prisma.JobCreateInput): Promise<Job> {
  return jobRepo.create(data);
}

export function updateJob(
  id: number,
  data: Prisma.JobUpdateInput
): Promise<Job> {
  return jobRepo.update(id, data);
}

export function deleteJob(id: number): Promise<Job> {
  return jobRepo.remove(id);
}
