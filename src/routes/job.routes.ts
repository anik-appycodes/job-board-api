import { Role } from "@prisma/client";
import { Router } from "express";
import {
  addJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/job.controller.js";
import { catchAsync } from "../helpers/api.helper.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getJobs));
router.get("/:id", catchAsync(getJobById));

router.post(
  "/",
  requireRole(Role.employer),
  validate(createJobSchema),
  catchAsync(addJob)
);

router.put(
  "/:id",
  requireRole(Role.employer),
  validate(updateJobSchema),
  catchAsync(updateJob)
);

router.delete("/:id", requireRole(Role.employer), catchAsync(deleteJob));

export default router;
