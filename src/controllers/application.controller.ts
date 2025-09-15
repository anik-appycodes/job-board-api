import type { Request, Response } from "express";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import { AppError } from "../middlewares/error.middleware.js";
import { applicationService } from "../services/application.service.js";
import { Prisma, Status } from "@prisma/client";
import { userService } from "../services/user.service.js";

// GET /applications?candidate_id=...&job_id=...
export const getApplications = catchAsync(
  async (req: Request, res: Response) => {
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
  }
);

export const getApplicationById = catchAsync(
  async (req: Request, res: Response) => {
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
  }
);

export const addApplication = catchAsync(
  async (req: Request, res: Response) => {
    const { job_id, candidate_id } = req.body;

    if (!job_id || !candidate_id)
      throw new AppError("job_id and candidate_id are required", 400);

    // Ensure the role = candidate
    const candidate = await userService.getUserById(Number(candidate_id));
    if (!candidate) throw new AppError("Candidate not found", 404);
    if (candidate.role !== "candidate")
      throw new AppError("Only users with candidate role can apply", 400);

    const newApplication = await applicationService.createApplication({
      job: { connect: { id: job_id } },
      candidate: { connect: { id: candidate_id } },
    } as Prisma.ApplicationCreateInput);

    return sendResponse(
      res,
      201,
      "Application created successfully",
      newApplication
    );
  }
);

export const updateApplication = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Application ID is required", 400);

    const { status } = req.body;
    if (!status || !Object.values(Status).includes(status))
      throw new AppError("Valid status is required", 400);

    const updated = await applicationService.updateApplication(Number(id), {
      status,
    });
    if (!updated) throw new AppError("Application not found", 404);

    return sendResponse(res, 200, "Application updated successfully", updated);
  }
);

export const deleteApplication = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Application ID is required", 400);

    const deleted = await applicationService.deleteApplication(Number(id));
    if (!deleted)
      throw new AppError("Application not found or already deleted", 404);

    return sendResponse(res, 200, "Application deleted successfully", deleted);
  }
);
