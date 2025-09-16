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
import { validate } from "../middlewares/validate.middleware.js";
import { rbacMiddleware } from "../services/rbac.service.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getJobs));
router.get("/:id", catchAsync(getJobById));

// RBAC middleware to protect routes below
router.use(rbacMiddleware());

router.post("/", validate(createJobSchema), catchAsync(addJob));
router.put("/:id", validate(updateJobSchema), catchAsync(updateJob));
router.delete("/:id", catchAsync(deleteJob));

export default router;
