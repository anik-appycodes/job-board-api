import { Router } from "express";
import {
  getJobs,
  addJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  requireAuth,
  requireRole("employer"),
  validate(createJobSchema),
  addJob
);

router.put(
  "/:id",
  requireAuth,
  requireRole("employer"),
  validate(updateJobSchema),
  updateJob
);

router.delete("/:id", requireAuth, requireRole("employer"), deleteJob);

export default router;
