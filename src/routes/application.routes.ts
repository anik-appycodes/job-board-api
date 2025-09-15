import { Router } from "express";
import {
  getApplications,
  getApplicationById,
  addApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", requireAuth, getApplications);
router.get("/:id", requireAuth, getApplicationById);

router.post(
  "/",
  requireAuth,
  requireRole("candidate"),
  validate(createApplicationSchema),
  addApplication
);

router.put(
  "/:id",
  requireAuth,
  requireRole("employer"),
  validate(updateApplicationSchema),
  updateApplication
);

router.delete("/:id", requireAuth, requireRole("employer"), deleteApplication);

export default router;
