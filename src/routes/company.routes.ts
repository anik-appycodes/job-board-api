import { Role } from "@prisma/client";
import { Router } from "express";
import {
  addCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import { catchAsync } from "../helpers/api.helper.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validations/company.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getCompanies));
router.get("/:id", catchAsync(getCompanyById));

router.post(
  "/",
  requireRole(Role.employer),
  validate(createCompanySchema),
  catchAsync(addCompany)
);

router.put(
  "/:id",
  requireRole(Role.employer),
  validate(updateCompanySchema),
  catchAsync(updateCompany)
);

router.delete("/:id", requireRole(Role.employer), catchAsync(deleteCompany));

export default router;
