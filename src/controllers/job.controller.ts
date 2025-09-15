import type { Request, Response } from "express";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import { AppError } from "../middlewares/error.middleware.js";
import { jobService } from "../services/job.service.js";
import { Prisma } from "@prisma/client";

// GET /jobs?location=&company_id=&minSalary=&maxSalary=&tags=tag1,tag2
export const getJobs = catchAsync(async (req: Request, res: Response) => {
  const {
    location,
    company_id,
    minSalary,
    maxSalary,
    tags,
    page = "1",
    limit = "10",
  } = req.query;

  const query: Prisma.JobWhereInput = {};
  if (location)
    query.location = { contains: String(location), mode: "insensitive" };
  if (company_id) query.company_id = Number(company_id);
  if (minSalary || maxSalary) {
    query.AND = [
      minSalary ? { salary_min: { gte: Number(minSalary) } } : {},
      maxSalary ? { salary_max: { lte: Number(maxSalary) } } : {},
    ];
  }
  if (tags) {
    const tagList = String(tags)
      .split(",")
      .map((t) => t.trim());
    query.tags = { hasSome: tagList };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const jobs = await jobService.getAllJobs(
    query,
    { created_at: "desc" },
    skip,
    take
  );
  return sendResponse(res, 200, "Jobs fetched successfully", jobs);
});

export const getJobById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Job ID is required", 400);

  const job = await jobService.getJobById(Number(id));
  if (!job) throw new AppError("Job not found", 404);

  return sendResponse(res, 200, "Job fetched successfully", job);
});

export const addJob = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    description,
    location,
    salary_min,
    salary_max,
    tags,
    company_id,
    posted_by,
  } = req.body;

  if (!title || !company_id || !posted_by) {
    throw new AppError("Title, company_id and posted_by are required", 400);
  }

  const newJob = await jobService.createJob({
    title,
    description,
    location,
    salary_min,
    salary_max,
    tags,
    company: { connect: { id: company_id } },
    postedBy: { connect: { id: posted_by } },
  } as Prisma.JobCreateInput);

  return sendResponse(res, 201, "Job created successfully", newJob);
});

export const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Job ID is required", 400);

  const { title, description, location, salary_min, salary_max, tags } =
    req.body;

  if (
    !title &&
    !description &&
    !location &&
    !salary_min &&
    !salary_max &&
    !tags
  ) {
    throw new AppError("At least one field is required to update", 400);
  }

  const updated = await jobService.updateJob(Number(id), {
    title,
    description,
    location,
    salary_min,
    salary_max,
    tags,
  });

  if (!updated) throw new AppError("Job not found", 404);

  return sendResponse(res, 200, "Job updated successfully", updated);
});

export const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Job ID is required", 400);

  const deleted = await jobService.deleteJob(Number(id));
  if (!deleted) throw new AppError("Job not found or already deleted", 404);

  return sendResponse(res, 200, "Job deleted successfully", deleted);
});
