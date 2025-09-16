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
import { validate } from "../middlewares/validate.middleware.js";
import { rbacMiddleware } from "../services/rbac.service.js";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validations/company.validation.js";

const router = Router();

router.use(requireAuth);

router.get("/", catchAsync(getCompanies));
router.get("/:id", catchAsync(getCompanyById));

// RBAC middleware to protect routes below
router.use(rbacMiddleware());

router.post("/", validate(createCompanySchema), catchAsync(addCompany));
router.put("/:id", validate(updateCompanySchema), catchAsync(updateCompany));
router.delete("/:id", catchAsync(deleteCompany));

export default router;
