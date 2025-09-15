import { Prisma, Role, Status } from "@prisma/client";
import type { Request, Response } from "express";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import { AppError } from "../middlewares/error.middleware.js";
import { applicationService } from "../services/application.service.js";
import { jobService } from "../services/job.service.js";

// GET /applications?candidate_id=...&job_id=...
export const getApplications = async (req: Request, res: Response) => {
  const { candidate_id, job_id } = req.query;

  const query: Prisma.ApplicationWhereInput = {};
  if (candidate_id) query.candidate_id = Number(candidate_id);
  if (job_id) query.job_id = Number(job_id);

  const applications = await applicationService.getAllApplications(query);
  return sendResponse(
    res,
    200,
    "Applications fetched successfully",
    applications
  );
};

export const getApplicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Application ID is required", 400);

  const application = await applicationService.getApplicationById(Number(id));
  if (!application) throw new AppError("Application not found", 404);

  return sendResponse(
    res,
    200,
    "Application fetched successfully",
    application
  );
};

export const addApplication = async (req: Request, res: Response) => {
  const { job_id } = req.body;
  const authUser = req?.user;

  if (authUser && authUser.role !== Role.candidate) {
    throw new AppError("Only candidates can apply to jobs", 403);
  }

  if (!job_id) throw new AppError("job_id is required", 400);

  const existing = await applicationService.getAllApplications({
    job_id: Number(job_id),
    candidate_id: authUser?.id,
  });
  if (existing.length > 0) {
    throw new AppError("You have already applied to this job", 400);
  }

  const newApplication = await applicationService.createApplication({
    job: { connect: { id: Number(job_id) } },
    candidate: { connect: { id: authUser?.id } },
  } as Prisma.ApplicationCreateInput);

  return sendResponse(
    res,
    201,
    "Application created successfully",
    newApplication
  );
};

export const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) throw new AppError("Application ID is required", 400);
  if (!status || !Object.values(Status).includes(status)) {
    throw new AppError("Valid status is required", 400);
  }

  const authUser = req?.user;

  const existing = await applicationService.getApplicationById(Number(id));
  if (!existing) throw new AppError("Application not found", 404);

  // Block updates if already finalized
  if (["ACCEPTED", "REJECTED"].includes(existing.status)) {
    throw new AppError(
      "You cannot update an application that is already accepted or rejected",
      400
    );
  }

  // Only employer can update
  const job = await jobService.getJobById(existing.job_id);
  if (!job || job.posted_by !== authUser?.id) {
    throw new AppError(
      "You can only update applications for your own jobs",
      403
    );
  }

  const updated = await applicationService.updateApplication(Number(id), {
    status,
  });
  return sendResponse(res, 200, "Application updated successfully", updated);
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Application ID is required", 400);

  const authUser = req?.user;

  const existing = await applicationService.getApplicationById(Number(id));
  if (!existing) throw new AppError("Application not found", 404);

  // Candidate can delete their own
  if (
    authUser &&
    authUser.role === Role.candidate &&
    existing.candidate_id !== authUser.id
  ) {
    throw new AppError("You can only delete your own applications", 403);
  }

  // Employer can delete only if they own the job
  if (authUser?.role === Role.employer) {
    const job = await jobService.getJobById(existing.job_id);
    if (!job || job.posted_by !== authUser.id) {
      throw new AppError(
        "You can only delete applications for your own jobs",
        403
      );
    }
  }

  const deleted = await applicationService.deleteApplication(Number(id));
  return sendResponse(res, 200, "Application deleted successfully", deleted);
};
