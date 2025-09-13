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

const router = Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", validate(createApplicationSchema), addApplication);
router.put("/:id", validate(updateApplicationSchema), updateApplication);
router.delete("/:id", deleteApplication);

export default router;
