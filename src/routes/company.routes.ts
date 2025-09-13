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

const router = Router();

router.get("/", getCompanies);
router.post("/", validate(createCompanySchema), addCompany);
router.get("/:id", getCompanyById);
router.put("/:id", validate(updateCompanySchema), updateCompany);
router.delete("/:id", deleteCompany);

export default router;
