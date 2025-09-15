import type { Job, Prisma } from "@prisma/client";
import { jobRepo } from "../repo/job.repo.js";

async function getAllJobs(
  query: Prisma.JobWhereInput = {},
  orderBy?: Prisma.JobOrderByWithRelationInput,
  skip?: number,
  take?: number
): Promise<Job[]> {
  return jobRepo.getAll(query, orderBy, skip, take);
}

async function getJobById(id: number): Promise<Job | null> {
  return jobRepo.getById(id);
}

async function createJob(data: Prisma.JobCreateInput): Promise<Job> {
  return jobRepo.create(data);
}

async function updateJob(
  id: number,
  data: Prisma.JobUpdateInput
): Promise<Job> {
  return jobRepo.update(id, data);
}

async function deleteJob(id: number): Promise<Job> {
  return jobRepo.remove(id);
}

export const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
