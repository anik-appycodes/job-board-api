import { Router } from "express";
import {
  getCompanies,
  addCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validations/company.validation.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyById);

router.post(
  "/",
  requireAuth,
  requireRole("employer"),
  validate(createCompanySchema),
  addCompany
);

router.put(
  "/:id",
  requireAuth,
  requireRole("employer"),
  validate(updateCompanySchema),
  updateCompany
);

router.delete("/:id", requireAuth, requireRole("employer"), deleteCompany);

export default router;
