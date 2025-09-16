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
import { validate } from "../middlewares/validate.middleware.js";
import { rbacMiddleware } from "../services/rbac.service.js"; // new DB-driven RBAC
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getApplications));
router.get("/:id", catchAsync(getApplicationById));

// Apply RBAC middleware to all routes below
router.use(rbacMiddleware());

router.post("/", validate(createApplicationSchema), catchAsync(addApplication));
router.put(
  "/:id",
  validate(updateApplicationSchema),
  catchAsync(updateApplication)
);
router.delete("/:id", catchAsync(deleteApplication));

export default router;
