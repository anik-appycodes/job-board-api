import { Role } from "@prisma/client";
import { Router } from "express";
import {
  addApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
} from "../controllers/application.controller.js";
import { catchAsync } from "../helpers/api.helper.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getApplications));
router.get("/:id", catchAsync(getApplicationById));

router.post(
  "/",
  requireRole(Role.candidate),
  validate(createApplicationSchema),
  catchAsync(addApplication)
);

router.put(
  "/:id",
  requireRole(Role.employer),
  validate(updateApplicationSchema),
  catchAsync(updateApplication)
);

router.delete("/:id", catchAsync(deleteApplication));

export default router;
