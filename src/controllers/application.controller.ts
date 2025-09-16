import { Prisma, Status } from "@prisma/client";
import type { Request, Response } from "express";
import { sendResponse } from "../helpers/api.helper.js";
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
  const authUser = req.user;

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

  const existing = await applicationService.getApplicationById(Number(id));
  if (!existing) throw new AppError("Application not found", 404);

  if (["ACCEPTED", "REJECTED"].includes(existing.status)) {
    throw new AppError(
      "You cannot update an application that is already accepted or rejected",
      400
    );
  }

  // Ensure the user owns the job
  const authUser = req.user;
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

  const existing = await applicationService.getApplicationById(Number(id));
  if (!existing) throw new AppError("Application not found", 404);

  if (["ACCEPTED", "REJECTED"].includes(existing.status)) {
    throw new AppError(
      "You cannot delete an application that is already accepted or rejected",
      400
    );
  }

  const authUser = req.user;

  // Candidate can delete only their own
  if (authUser?.id === existing.candidate_id) {
    const deleted = await applicationService.deleteApplication(Number(id));
    return sendResponse(res, 200, "Application deleted successfully", deleted);
  }

  // Employer can delete only if they own the job
  const job = await jobService.getJobById(existing.job_id);
  if (job?.posted_by === authUser?.id) {
    const deleted = await applicationService.deleteApplication(Number(id));
    return sendResponse(res, 200, "Application deleted successfully", deleted);
  }

  throw new AppError(
    "You do not have permission to delete this application",
    403
  );
};
